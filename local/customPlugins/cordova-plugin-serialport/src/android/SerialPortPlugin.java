
package cn.xxl.cordova.serialport;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.util.Iterator;
import java.util.Vector;

import android_serialport_api.SerialPortFinder;

public class SerialPortPlugin extends CordovaPlugin {

    private Vector<SerialPortEntity> mSerialPorts = new Vector<SerialPortEntity>();

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

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
        if (mSerialPorts.size() > 0) {
            callbackContext.success();
            return;
        }
        final JSONArray ports = args.getJSONArray(0);
        final JSONObject options = args.getJSONObject(1);
        final int baudRate = options.has("baudrate") ? options.getInt("baudrate") : 9600;
        final String parser = options.has("parser") ? options.getString("parser") : "";

        final SerialPortPlugin instance = this;

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    String[] tempPorts;
                    if (ports.length() > 0) {
                        tempPorts = new String[ports.length()];
                        for (int i = 0; i < ports.length(); i++) {
                            tempPorts[i] = ports.getString(i);
                        }
                    } else {
                        SerialPortFinder serialPortFinder = new SerialPortFinder();
                        tempPorts = serialPortFinder.getAllDevicesPath();
                    }
                    for (int i = 0; i < tempPorts.length; i++) {
                        SerialPortEntity serialPortEntity = new SerialPortEntity();
                        if (serialPortEntity.open(tempPorts[i], baudRate, parser, 0)) {
                            serialPortEntity.setSerialPortPlugin(instance);
                            mSerialPorts.add(serialPortEntity);
                        } else {
                            serialPortEntity.close();
                        }
                    }
                    if (mSerialPorts.size() > 0) {
                        callbackContext.success();
                    } else {
                        callbackContext.error("打开串口失败");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    callbackContext.error("打开串口失败");
                }
            }
        });
    }

    private void closeSerialPort() {
        if (mSerialPorts.size() == 0) {
            return;
        }
        Iterator<SerialPortEntity> itPort = mSerialPorts.iterator();
        while(itPort.hasNext()) {
            itPort.next().close();
        }
        mSerialPorts.removeAllElements();
    }

    public void onDataReceived(final String port, final String input) {
        try {
            cordova.getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    String jsEvent = String.format(
                            "cordova.fireDocumentEvent('serialport.DataReceived',{'serialPort':'%s','serialPortData':'%s'})",
                            port, input);
                    webView.sendJavascript(jsEvent);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        closeSerialPort();
        super.onDestroy();
    }
}