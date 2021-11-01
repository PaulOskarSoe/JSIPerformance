//
//  ImageLabelProcessorPlugin.m
//  JSIPeformance
//
//  Created by Paul Oskar Soe on 01.11.2021.
//

#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <MLKit.h>

@interface ImageLabelerProcessorPlugin : NSObject

@end

@implementation ImageLabelerProcessorPlugin

+ (MLKImageLabeler*) labeler {
  static MLKImageLabeler* labeler = nil;
  if (labeler == nil) {
    MLKImageLabelerOptions* options = [[MLKImageLabelerOptions alloc] init];
    labeler = [MLKImageLabeler imageLabelerWithOptions:options];
  }
  return labeler;
}
 

static inline id labelImage(Frame* frame, NSArray* arguments){
  MLKVisionImage *image = [[MLKVisionImage alloc] initWithBuffer:frame.buffer];

  image.orientation = frame.orientation; // <-- TODO: is mirrored?
  

  NSError* error;
  NSArray<MLKImageLabel*>* labels = [[ImageLabelerProcessorPlugin labeler] resultsInImage:image error:&error];
  
  NSMutableArray* results = [NSMutableArray arrayWithCapacity:labels.count];

  for (MLKImageLabel* label in labels) {
     [results addObject:@{
       @"label": label.text,
       @"confidence": [NSNumber numberWithFloat:label.confidence]
     }];
   }

   return results;
  

  return nil;
}

VISION_EXPORT_FRAME_PROCESSOR(labelImage)

@end
