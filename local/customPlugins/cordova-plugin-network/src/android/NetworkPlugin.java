
package cn.xxl.cordova.network;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.http.conn.util.InetAddressUtils; 

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.content.Context;
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
                    String ipAddress = inetAddress.getHostAddress().toString();
                    if (!inetAddress.isLoopbackAddress() && InetAddressUtils.isIPv4Address(ipAddress)) {     
                        return ipAddress;     
                    }
                }     
            }     
        } catch (SocketException e) {     
            e.printStackTrace();
            return "";
        }     
        return "";     
    }     
         
    private String getMacAddress() {     
        WifiManager wifi = (WifiManager)this.cordova.getActivity().getApplicationContext().getSystemService(Context.WIFI_SERVICE);     
        WifiInfo info = wifi.getConnectionInfo();     
        return info.getMacAddress();     
    } 
}