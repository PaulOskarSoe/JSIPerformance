//
//  DeviceInformationModule.swift
//  JSIPeformance
//
//  Created by Paul Oskar Soe on 04.03.2022.
//

import Foundation
import UIKit


@objc(DeviceInformationModule)
class DeviceInformationModule: NSObject {

  
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
  }

  
  @objc
  func getModel(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) -> Void {
    let device = UIDevice();
    
    if (device.name == nil) {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Device error", "Device must be iphone", error)
    } else {
      resolve(device.name)
    }
  }
  
}


