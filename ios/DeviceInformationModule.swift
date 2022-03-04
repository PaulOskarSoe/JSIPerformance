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

  let device = UIDevice();
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
  }

  
  @objc
  func getModel(_ callback: RCTResponseSenderBlock) {
    print("triggered")
    callback(["tere"])
  }

  
}


