
package cn.xxl.cordova.serialport;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaArgs;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.security.InvalidParameterException;

import android_serialport_api.SerialPort;
import android_serialport_api.SerialPortFinder;

public class SerialPortPlugin extends CordovaPlugin {

    private SerialPort mSerialPort;

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
                    callbackContext.success();
                } catch (Exception e) {
                    e.printStackTrace();
                    callbackContext.error("打开串口失败");
                }
            }
        });
    }

    public void closeSerialPort() {
        if (mSerialPort != null) {
            mSerialPort.close();
            mSerialPort = null;
        }
    }
}