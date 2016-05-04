
package cn.xxl.cordova.network;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

import java.net.SocketException; 

public class NetworkPlugin extends CordovaPlugin {

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        
        if (action.equals("getInfo")) {
            JSONObject r = new JSONObject();
            r.put("ip", getIpAddress());
            r.put("mac", getMacAddress());
            callbackContext.success(r);
            return true;
        }

        return false;
    }

    private String getIpAddress() {     
        try {     
            for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {     
                NetworkInterface intf = en.nextElement();     
                for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();) {     
                    InetAddress inetAddress = enumIpAddr.nextElement();     
                    if (!inetAddress.isLoopbackAddress()) {     
                        return inetAddress.getHostAddress().toString();     
                    }
                }     
            }     
        } catch (SocketException ex) {     
            e.printStackTrace();
            return;
        }     
        return null;     
    }     
         
    private String getMacAddress() {     
        WifiManager wifi = (WifiManager)getSystemService(Context.WIFI_SERVICE);     
        WifiInfo info = wifi.getConnectionInfo();     
        return info.getMacAddress();     
    } 
}