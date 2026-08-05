import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { BaseWorker } from './base_worker'

class BlazePoseWorker extends BaseWorker {
  constructor() {
    super();
  }

  async initializeTask() {
    console.log('initializeTask before vision init!')
    const vision = await FilesetResolver.forVisionTasks(
                "/wasm"
            );
    const response = await fetch(vision.wasmLoaderPath);
    eval?.(await response.text());
    delete vision.wasmLoaderPath;
    console.log('initializeTask before taskInstance init!');
    this.taskInstance = await PoseLandmarker.createFromOptions(
                vision,
                {
                baseOptions: {
                    modelAssetPath: '/models/pose_landmarker_full.task'
                },
                runningMode: 'VIDEO',
                numPoses: 1
                }
            );
    console.log('initializeTask after taskInstance init!')
  }

  handleCustomMessage(data) {
    const { type } = data;
    if (type == 'DETECT_POSE') {
      try {
        const {vidBitmap} = data;
        const {inferenceTime, timestamp, result} = this.detectStream(vidBitmap)
        if (result.landmarks.length == 0) {
          self.postMessage({type: 'DETECT_NO_POSE'});
        }
        else {
          self.postMessage({type: 'DETECT_RESULT', inferenceTime: inferenceTime,
          timestamp: timestamp, result: result});
        } 
      }
      catch (err) {
        console.error('Worker detection error: ', err);
        self.postMessage({ type: 'DETECT_ERROR', error: err.message || 'Detection failed' });
      }
    }
  }

  detectStream(vidBitmap) {
    const timestamp = performance.now();

    const poseLandmarkerResult = this.taskInstance.detectForVideo(vidBitmap, timestamp);
    vidBitmap.close();
    const inferenceTime = performance.now() - timestamp;
    return { inferenceTime: inferenceTime, timestamp: timestamp, result: poseLandmarkerResult };
  }
}

export default new BlazePoseWorker();