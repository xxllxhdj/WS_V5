
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

    private Vector<SerialPortEntity> mSerialPorts = null;

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
        if (mSerialPorts != null) {
            callbackContext.success();
            return;
        }
        final int baudRate = args.getInt(0);
        final String parser = args.getString(1);

        final SerialPortPlugin instance = this;

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                SerialPortFinder serialPortFinder = new SerialPortFinder();
                String[] ports = serialPortFinder.getAllDevicesPath();
                mSerialPorts = new Vector<SerialPortEntity>();
                for (int i = 0; i < ports.length; i++) {
                    SerialPortEntity serialPortEntity = new SerialPortEntity();
                    if (serialPortEntity.open(ports[i], baudRate, parser, 0)) {
                        serialPortEntity.setSerialPortPlugin(instance);
                        mSerialPorts.add(serialPortEntity);
                    }
                }
                callbackContext.success();
            }
        });
    }

    private void closeSerialPort() {
        if (mSerialPorts != null) {
            Iterator<SerialPortEntity> itPort = mSerialPorts.iterator();
            while(itPort.hasNext()) {
                itPort.next().close();
            }
            mSerialPorts = null;
        }
    }

    public void onDataReceived(final String input) {
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

    @Override
    public void onDestroy() {
        closeSerialPort();
        super.onDestroy();
    }
}