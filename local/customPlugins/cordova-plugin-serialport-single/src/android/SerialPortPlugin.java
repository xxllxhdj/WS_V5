
package cn.xxl.cordova.serialport;

import android.app.Activity;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.InvalidParameterException;
import java.util.Timer;
import java.util.TimerTask;

import android_serialport_api.SerialPort;
import android_serialport_api.SerialPortFinder;

public class SerialPortPlugin extends CordovaPlugin {

    private SerialPort mSerialPort;
    private InputStream mInputStream;

    private String mParser = "";
    private String mInputCache = "";
    private boolean mIsTimer = true;
    private boolean mThreadRunning = false;
    private Timer mTimer;

    private class ReadThread extends Thread {
        @Override
        public void run () {
            while (mThreadRunning) {
                try {
                    if (mInputStream == null) {
                        continue;
                    }
                    byte[] buffer = new byte[64]; 
                    int size = mInputStream.read(buffer);
                    if (size <= 0) {
                        continue;
                    }
                    String input = bytesToHexString(buffer, size);
                    mInputCache += input;
                    if (mParser.length() > 0) {
                        if (mInputCache.endsWith(mParser)) {
                            onDataReceived(mInputCache);
                            mInputCache = "";
                        }
                    } else {
                        if (!mIsTimer) {
                            continue;
                        }
                        mIsTimer = false;
                        if (mTimer != null) {
                            mTimer.cancel();
                        }
                        mTimer = new Timer(); 
                        mTimer.schedule(new TimerTask () {
                            public void run () {
                                if (mThreadRunning) {
                                    onDataReceived(mInputCache);
                                    mInputCache = "";
                                    mIsTimer = true;
                                }
                            }
                        }, 75);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (mTimer != null) {
                mTimer.cancel();
                mTimer = null;
            }
            if (mSerialPort != null) {
                mSerialPort.close();
                mSerialPort = null;
            }
            mInputCache = "";
            mInputStream = null;
            mIsTimer = true;
        }
    }

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        
        if (action.equals("getAllDevices")) {
            SerialPortFinder serialPortFinder = new SerialPortFinder();
            String[] entryNames = serialPortFinder.getAllDevices();
            String[] entryPaths = serialPortFinder.getAllDevicesPath();
            JSONArray resPorts = new JSONArray();
            for (int i = 0; i < entryNames.length; i++) {
                JSONObject port = new JSONObject();
                port.put("name", entryNames[i]);
                port.put("path", entryPaths[i]);
                resPorts.put(i, port);
            }
            callbackContext.success(resPorts);
            serialPortFinder = null;
            return true;
        }

        if (action.equals("open")) {
            openSerialPort(args, callbackContext);
            return true;
        }

        if (action.equals("close")) {
            closeSerialPort();
            return true;
        }

        return false;
    }

    private void openSerialPort(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String port = args.getString(0);
        final JSONObject options = args.getJSONObject(1);
        final int baudRate = options.has("baudrate") ? options.getInt("baudrate") : 9600;
        mParser = options.has("parser") ? options.getString("parser") : "";
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    if ((port.length() == 0) || (baudRate == -1)) {
                        throw new InvalidParameterException();
                    }
                    if (mSerialPort != null) {
                        mSerialPort.close();
                    }
                    mSerialPort = new SerialPort(new File(port), baudRate, 0);

                    mInputStream = mSerialPort.getInputStream();
                    mInputCache = "";
                    mIsTimer = true;
                    mThreadRunning = true;

                    new ReadThread().start();
                    
                    callbackContext.success();
                } catch (Exception e) {
                    e.printStackTrace();
                    callbackContext.error("打开串口失败");
                }
            }
        });
    }

    private void closeSerialPort() {
        mThreadRunning = false;
    }

    private void onDataReceived(final String input) {
        try {
            cordova.getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    String jsEvent = String.format(
                            "cordova.fireDocumentEvent('serialport.DataReceived',{'serialPortData':'%s'})",
                            input);
                    webView.sendJavascript(jsEvent);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String bytesToHexString(byte[] bArray, int size) {
        String ret = ""; 
        for (int i = 0; i < size; i++) { 
            String hex = Integer.toHexString(bArray[i] & 0xFF); 
            if (hex.length() == 1) { 
                hex = '0' + hex; 
            } 
            ret += hex.toUpperCase(); 
        } 
        return ret;
    } 

    @Override
    public void onDestroy() {
        closeSerialPort();
        super.onDestroy();
    }
}