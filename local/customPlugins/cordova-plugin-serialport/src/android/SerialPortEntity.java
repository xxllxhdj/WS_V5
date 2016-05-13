
package cn.xxl.cordova.serialport;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;

import android_serialport_api.SerialPort;

public class SerialPortEntity {

    private SerialPort mSerialPort;
    private OutputStream mOutputStream;
    private InputStream mInputStream;

    private ReadThread mReadThread;

    private String mParser;
    private String mInputCache = "";

    private SerialPortPlugin mSerialPortPlugin;

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
                        mSerialPortPlugin.onDataReceived(mInputCache.substring(0, mInputCache.length() - mParser.length()));
                        mInputCache = "";
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    return;
                }
            }
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
            mSerialPort = new SerialPort(new File(port), baudrate, flags);

            mOutputStream = mSerialPort.getOutputStream();
            mInputStream = mSerialPort.getInputStream();

            mParser = parser;

            if (mReadThread != null) {
                mReadThread.interrupt();
            }
            mReadThread = new ReadThread();
            mReadThread.start();

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void close() {
        if (mSerialPort != null) {
            mSerialPort.close();
            mSerialPort = null;
        }
        if (mReadThread != null) {
            mReadThread.interrupt();
        }
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