
package cn.xxl.cordova.serialport;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import android_serialport_api.SerialPort;

public class SerialPortEntity {

    private String mPort;
    private SerialPort mSerialPort;
    private InputStream mInputStream;

    private boolean mStopThread;
    private boolean mIsTimer = true;
    private Timer mTimer;

    private String mParser;
    private String mInputCache = "";

    private SerialPortPlugin mSerialPortPlugin;

    private class ReadThread extends Thread {
        @Override
        public void run () {
            while (!mStopThread) {
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
                            mSerialPortPlugin.onDataReceived(mPort, mInputCache);
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
                                if (!mStopThread) {
                                    mSerialPortPlugin.onDataReceived(mPort, mInputCache);
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

    public void setSerialPortPlugin(SerialPortPlugin serialPortPlugin) {
        mSerialPortPlugin = serialPortPlugin;
    }

    public boolean open(String port, int baudrate, String parser, int flags) {
        try {
            if ((port.length() == 0) || (baudrate == -1)) {
                return false;
            }
            mPort = port;
            mSerialPort = new SerialPort(new File(port), baudrate, flags);
            mInputStream = mSerialPort.getInputStream();
            mParser = parser;
        
            mStopThread = false;
            new ReadThread().start();

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void close() {
        mStopThread = true;
    }

    private String bytesToHexString(byte[] bArray, int size) {
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
}