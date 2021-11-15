//
//  BarcodeScanProcessorPlugin.m
//  JSIPeformance
//
//  Created by Paul Oskar Soe on 15.11.2021.
//

#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <MLKit.h>

@interface BarcodeScanProcessorPlugin: NSObject

@end

@implementation BarcodeScanProcessorPlugin

//+ (MLKBarcodeScanner *) scanner {
//  static MLKBarcodeScanner* scanner = nil;
//  if(scanner == nil){
//    MLKBarcodeScanner* options = [[MLKBarcodeScanner alloc] init];
//    scanner = [MLKBarcodeScanner barcodeScannerWithOptions:options];
//  }
//  return scanner;
//}

static inline id scanBarcode(Frame* frame, NSArray* arguments){


  MLKVisionImage *image = [[MLKVisionImage alloc] initWithBuffer:frame.buffer];


  
  image.orientation = frame.orientation;
  
  
  
  NSMutableDictionary *response = [NSMutableDictionary dictionary];

  MLKBarcodeScanner *barcodeScanner = [MLKBarcodeScanner barcodeScanner];
  
  
  [barcodeScanner processImage:image
                    completion:^(NSArray<MLKBarcode *> *_Nullable barcodes,
                                 NSError *_Nullable error) {
   
  }];
  

    
  return response;
  
  return nil;
  
  }

VISION_EXPORT_FRAME_PROCESSOR(scanBarcode)

@end
