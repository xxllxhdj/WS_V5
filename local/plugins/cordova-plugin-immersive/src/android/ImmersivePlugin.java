
package cn.xxl.cordova.immersive;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import android.content.res.Resources;
import android.os.Build;
import android.util.DisplayMetrics;
 import android.view.Display;

public class ImmersivePlugin extends CordovaPlugin {

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getImmersive")) {
            JSONObject result = new JSONObject();

            if ((Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) && hasNavigationBar()) {
                result.put("immersive", getNavigationBarHeight());
            }

            PluginResult r = new PluginResult(PluginResult.Status.OK, result);
            r.setKeepCallback(true);
            callbackContext.sendPluginResult(r);
            return true;
        }

        return false;
    }

    private int getNavigationBarHeight() {  
        Resources resources = this.cordova.getActivity().getResources();  
        int resourceId = resources.getIdentifier("navigation_bar_height",  
                "dimen", "android");   
        int height = resources.getDimensionPixelSize(resourceId);

        DisplayMetrics dm = new DisplayMetrics();
        cordova.getActivity().getWindowManager().getDefaultDisplay().getMetrics(dm);
        final float density = dm.density;

        return (int)(height / density);  
    }

    private boolean hasNavigationBar() {   
        Display d = this.cordova.getActivity().getWindowManager().getDefaultDisplay();  
  
        DisplayMetrics realDisplayMetrics = new DisplayMetrics();  
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {  
            d.getRealMetrics(realDisplayMetrics);  
        }
  
        int realHeight = realDisplayMetrics.heightPixels;  
        int realWidth = realDisplayMetrics.widthPixels;  
  
        DisplayMetrics displayMetrics = new DisplayMetrics();  
        d.getMetrics(displayMetrics);  
  
        int displayHeight = displayMetrics.heightPixels;  
        int displayWidth = displayMetrics.widthPixels;  
  
        return (realWidth - displayWidth) > 0 || (realHeight - displayHeight) > 0;    
    }
}