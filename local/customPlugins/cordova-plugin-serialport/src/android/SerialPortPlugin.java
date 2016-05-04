
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

import android_serialport_api.SerialPort;
import android_serialport_api.SerialPortFinder;

public class SerialPortPlugin extends CordovaPlugin {

    private SerialPort mSerialPort;
    private OutputStream mOutputStream;
    private InputStream mInputStream;
    private ReadThread mReadThread;

    String mParser = "0A";
    String mInputCache = "";

    private class ReadThread extends Thread {
        @Override
        public void run() {
            super.run();
            while (!isInterrupted()) {
                try {
                    if (mInputStream == null) {
                        return;
                    }
                    byte[] buffer = new byte[64]; 
                    int size = mInputStream.read(buffer);
                    if (size <= 0) {
                        return;
                    }
                    String input = bytesToHexString(buffer, size);
                    mInputCache += input;
                    if (mInputCache.endsWith(mParser)) {
                        onDataReceived(mInputCache.substring(0, mInputCache.length() - mParser.length()));
                        mInputCache = "";
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    return;
                }
            }
        }
    }

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        
        if (action.equals("getSerialPort")) {
            SerialPortFinder serialPortFinder = new SerialPortFinder();
            String[] entryValues = serialPortFinder.getAllDevicesPath();
            JSONArray resPorts = new JSONArray();
            for (int i = 0; i < entryValues.length; i++) {
                resPorts.put(i, entryValues[i]);
            }
            callbackContext.success(resPorts);
            serialPortFinder = null;
            return true;
        }

        if (action.equals("openSerialPort")) {
            openSerialPort(args, callbackContext);
            return true;
        }

        if (action.equals("closeSerialPort")) {
            closeSerialPort();
            return true;
        }

        return false;
    }

    private void openSerialPort(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String port = args.getString(0);
        final JSONObject options = args.getJSONObject(1);
        final int baudRate = options.has("baudrate") ? options.getInt("baudrate") : 9600;
        mParser = options.has("parser") ? options.getString("parser") : "0A";
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

                    mOutputStream = mSerialPort.getOutputStream();
                    mInputStream = mSerialPort.getInputStream();
                    mInputCache = "";

                    if (mReadThread != null) {
                        mReadThread.interrupt();
                    }
                    mReadThread = new ReadThread();
                    mReadThread.start();
                    
                    callbackContext.success();
                } catch (Exception e) {
                    e.printStackTrace();
                    callbackContext.error("打开串口失败");
                }
            }
        });
    }

    private void closeSerialPort() {
        if (mSerialPort != null) {
            mSerialPort.close();
            mSerialPort = null;
        }
        if (mReadThread != null) {
            mReadThread.interrupt();
        }
        mInputCache = "";
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