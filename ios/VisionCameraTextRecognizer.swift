//
//  VisionCameraTextRecognizer.swift
//  JSIPeformance
//
//  Created by Paul Oskar Soe on 23.01.2022.
//

import MLKit;
//import MLKitTextRecognition;




@objc(VisionCameraTextRecognizer)
public class VisionCameraTextRecognizer: NSObject, FrameProcessorPluginBase {

  
  @objc
  public static func callback(_ frame: Frame!, withArgs _: [Any]!) -> Any! {
    
//    let orientation = frame.orientation
//    let textRecognizer = TextRecognizer.textRecognizer()
//
//
//    let visionImage = VisionImage(buffer: frame.buffer)
//    visionImage.orientation = orientation
//
//
//
//
//    var resultToReturn: Any = []
//
//
//    textRecognizer.process(visionImage) { result, error in
//      guard error == nil, let result = result else {
//        resultToReturn = result;
//        // Error handling
//        return
//      }
//      // Recognized text
//    }
//
    
    // code goes here
    return []
  }
  
  
}
