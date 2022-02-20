package com.jsipeformance;

import android.annotation.SuppressLint;
import android.media.Image;
import android.os.Build;

import androidx.annotation.RequiresApi;
import androidx.camera.core.ImageProxy;
//
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.TextRecognizerOptions;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class TextRecognizerFrameProcessorPlugin extends FrameProcessorPlugin {

  TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);


  @RequiresApi(api = Build.VERSION_CODES.N)
  @Override
  public Object callback(ImageProxy frame, Object[] params) {
    @SuppressLint("UnsafeOptInUsageError")
    Image mediaImage = frame.getImage();

    if(mediaImage != null){
      InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
      Task<Text> task = recognizer.process(image);

      HashMap<String, List<String>> result = new HashMap<String, List<String>>();

      try {
        Text textResult = Tasks.await(task);

        result.put("text", new ArrayList<String>());
        result.put("blocks", new ArrayList<String>());
        result.put("lines", new ArrayList<String>());
        result.put("elements", new ArrayList<String>());

        result.get("text").add(textResult.getText());


        List<Text.TextBlock> blocks = textResult.getTextBlocks();

        blocks.forEach(block -> {
          result.get("blocks").add(block.getText());
          block.getLines().forEach(line -> {
            result.get("lines").add(line.getText());
            line.getElements().forEach(element -> {
             result.get("elements").add(element.getText());
            });
          });

        });


        return result;

      } catch (Exception e) {
        System.out.println("Failed to process image!");
        e.printStackTrace();
      }

    }


    // code goes here
    System.out.println("Text logic");
    return null;
  }

  TextRecognizerFrameProcessorPlugin() {
    super("recognizeText");
  }
}
