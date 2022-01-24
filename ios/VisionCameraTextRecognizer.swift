//
//  VisionCameraTextRecognizer.swift
//  JSIPeformance
//
//  Created by Paul Oskar Soe on 23.01.2022.
//

import MLKit;
import MLKitTextRecognition;




@objc(VisionCameraTextRecognizer)
public class VisionCameraTextRecognizer: NSObject, FrameProcessorPluginBase {

  
  @objc
  public static func callback(_ frame: Frame!, withArgs _: [Any]!) -> Any! {
    
    let orientation = frame.orientation
    let textRecognizer = TextRecognizer.textRecognizer()


    let visionImage = VisionImage(buffer: frame.buffer)
    visionImage.orientation = orientation

    print("orinetation:", orientation)


    var resultToReturn: [String] = ["1"]


//    textRecognizer.process(visionImage) { result, error in
//      guard error == nil, let result = result else {
//
//        // Error handling
//        return
//      }
//
//      result.blocks.forEach { TextBlock  in
//        print("text block text:", TextBlock.text)
//        resultToReturn.append("2")
//        print("appended array:", TextBlock.text, resultToReturn)
//
//      }
//
      
      // Recognized text
//    }

    print("resultToReturn array:", resultToReturn)
    // code goes here
    return resultToReturn
  }
  
  
}
