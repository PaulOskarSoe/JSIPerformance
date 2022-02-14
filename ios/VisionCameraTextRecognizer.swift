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
    let textRecognizer = TextRecognizer.textRecognizer()
    
    
    let visionImage = VisionImage(buffer: frame.buffer)
    visionImage.orientation = .up
    
    var resultMap: [String: Any] = [:]
    
    do {
      let result: Text = try textRecognizer.results(in: visionImage);
      
      resultMap["text"] = result.text;
      
      var blocks: [String] = []
      var lines: [String] = []
      var elements: [String] = []
      
      for  block in result.blocks {
        blocks.append(block.text)
        
        for line in block.lines {
          lines.append(line.text)
          
          for element in line.elements {
            elements.append(element.text)
          }
        }
      }
      
      resultMap["blocks"] = blocks;
      resultMap["lines"] = lines;
      resultMap["elements"] = elements;
      
    } catch _ {
      return nil
    }
    
    
    
    return resultMap
    
  }
}

