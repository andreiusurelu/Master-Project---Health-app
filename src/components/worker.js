import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

const warmUpModel = async () =>  {
    // const vision = await FilesetResolver.forVisionTasks(
    // "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
    // const poseLandmarker = await PoseLandmarker.createFromOptions(
    //     vision,
    // {
    //   baseOptions: {
    //     modelAssetPath: '/models/pose_landmarker_full.task'
    //   },
    //   runningMode: 'VIDEO',
    //   numPoses: 1
    // }
    // );
    console.log('Model is warmed up!');

    // const dummyVideo = Video();
    // dummyVideo.src = 'band_pull_apart.mp4';

    // dummyVideo.onload = async () => {
    //     await poseLandmarker.detectForVideo(dummyVideo, performance.now());
    //     console.log('Model is warmed up!');
    // }
}



onmessage = (event) => {
  if (event.data === 'warmUp') {
    warmUpModel();
  }
}