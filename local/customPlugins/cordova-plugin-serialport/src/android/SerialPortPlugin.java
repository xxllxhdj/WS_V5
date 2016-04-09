
package cn.xxl.cordova.serialport;

import android.app.Activity;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaArgs;
import org.json.JSONArray;
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

    private static SerialPortPlugin instance;

    public SerialPortPlugin() {
        instance = this;
    }

    private class ReadThread extends Thread {
        @Override
        public void run() {
            super.run();
            while (!isInterrupted()) {
                int size;
                try {
                    byte[] buffer = new byte[64];
                    if (mInputStream == null) {
                        return;
                    }
                    
                    size = mInputStream.read(buffer);
                    if (size > 0) {
                        onDataReceived(buffer, size);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    return;
                }
            }
        }
    }

    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        
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

    private void openSerialPort(final CordovaArgs args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    int baudRate = args.getInt(1);
                    String port = args.getString(0);
                    if ((port.length() == 0) || (baudRate == -1)) {
                        throw new InvalidParameterException();
                    }
                    if (mSerialPort != null) {
                        mSerialPort.close();
                    }
                    mSerialPort = new SerialPort(new File(port), baudRate, 0);

                    mOutputStream = mSerialPort.getOutputStream();
                    mInputStream = mSerialPort.getInputStream();

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
    }

    private void onDataReceived(final byte[] buffer, final int size) {
        final Activity cordovaActivity = cordova.getActivity();
        cordovaActivity.runOnUiThread(new Runnable() {
            public void run() {
                String data = new String(buffer, 0, size);
                try {
                    final String jsEvent = String.format(
                            "cordova.fireDocumentEvent('serialport.DataReceived',%s)",
                            data);
                    cordovaActivity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            instance.webView.loadUrl("javascript:" + jsEvent);
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public void onDestroy() {
        closeSerialPort();
        super.onDestroy();
    }
}