
package cn.xxl.cordova.serialport;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android_serialport_api.SerialPort;
import android_serialport_api.SerialPortFinder;

public class SerialPortPlugin extends CordovaPlugin {

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

        return false;
    }


}