//
//  DeviceInformationModule.m
//  JSIPeformance
//
//  Created by Paul Oskar Soe on 04.03.2022.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(DeviceInformationModule, NSObject)

RCT_EXTERN_METHOD(getModel: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

@end
