package com.jsipeformance;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;


public class DeviceInformationModule extends ReactContextBaseJavaModule {
    String deviceName = android.os.Build.MODEL; // returns model name

    DeviceInformationModule(ReactApplicationContext context){
        super(context);
    }

    @Override
    public String getName() {
        return "DeviceInformationModule";
    }

    @ReactMethod
    public void getModel(Promise promise){
        promise.resolve(deviceName);
    }

}
