
import { FilesetResolver, PoseLandmarker, DrawingUtils} from '@mediapipe/tasks-vision'
import { globalStates } from './state'
import { constants } from './constants'

class CameraSDK extends EventTarget {
    constructor() {
        super();
        this.isRunning = false;
        this.isDetecting = false;
        this.video = null;
        this.previousLandmarks = null;
        this.poseLandmarker = null;
        this.canvasElement = null;
        this.canvasCtx = null;
        this.drawingUtils = null;
    }

    async init() {
        this.initModel();
        this.warmupModel();
    }

    setupCanvas() {
        this.canvasElement = document.getElementById('canvasOverlay');
        if (this.canvasElement) {
            this.canvasCtx = this.canvasElement.getContext('2d');
        }
        else {
            console.error("Couldn't find canvasOverlay");
        }
        this.canvasElement.width = 640;
        this.canvasElement.height = 480;
    }

    async initModel() {
        if (this.isRunning)
            return;
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
        );
        console.log('vision object:', vision)
        console.log('vision keys:', Object.keys(vision))
        if (navigator.gpu) {

        }
        else {
            
        }
        this.poseLandmarker = await PoseLandmarker.createFromOptions(
            vision,
            {
            baseOptions: {
                modelAssetPath: '/models/pose_landmarker_full.task'
            },
            runningMode: 'VIDEO',
            numPoses: 1
            }
        );
        this.isRunning = true;
        globalStates.setModelLoaded(true);
    }

    async warmupModel() {
        if (typeof Worker !== 'undefined') {
            const worker = new Worker(new URL('worker.js', import.meta.url),
        {type: 'module'});
            worker.postMessage('warmUp');
        }
    }

    async detectStream(video, display) {
        const timestamp = performance.now();

        if (this.isDetecting) {
            if (display) {
                this.displayVideoResult(this.previousLandmarks)
            }
            return null;
        }
        else {
            if (this.isRunning) {
                this.isDetecting = true;
                this.video = video;
                const poseLandmarkerResult = this.poseLandmarker.detectForVideo(video, timestamp);
                if (display) {
                    this.displayVideoResult(poseLandmarkerResult);
                }
                this.previousLandmarks = poseLandmarkerResult;
                this.isDetecting = false
                return { timestamp: performance.now(), landmarks: poseLandmarkerResult };
            }
            else {
                this.initModel();
                return null;
            }
        }
    }

    checkVisbilitySideways(landmarks) {
        return constants.indicesGroups.every(group => group.some(i => (landmarks[i]?.visibility ?? 0) > constants.visibilityThreshold))
    }

    checkVisibilityFront(landmarks) {
        constants.indices.filter(i => landmarks[i].visibility > constants.visibilityThreshold).length == constants.indices.length
    }

    checkPreviousLandmarks() {
        if (this.previousLandmarks) {
            const landmarks = this.previousLandmarks.landmarks.length == 1 ?
                this.previousLandmarks.landmarks[0] : this.previousLandmarks.landmarks
            if (this.checkVisibilityFront(landmarks) || this.checkVisbilitySideways(landmarks)) {
                return globalStates.detectionState['VISIBLE']
            }
            else {
                return globalStates.detectionState['MOVE']
            }
        }
        else
            return globalStates.detectionState['NO_HISTORY']
    }

    displayVideoResult(result) {
        if (this.canvasElement) {

            this.canvasCtx.save();
            this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);


            this.canvasCtx.beginPath();
            this.canvasCtx.rect(0, 0, this.canvasElement.width, this.canvasElement.height);
            this.canvasCtx.clip();

            if (result.landmarks) {
                if (!this.drawingUtils) this.drawingUtils = new DrawingUtils(this.canvasCtx);
                else this.drawingUtils = new DrawingUtils(this.canvasCtx);

                for (const landmark of result.landmarks) {
                    this.drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
                    });
                    this.drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
                }
            }
            this.canvasCtx.restore();
        }
        else {
            this.setupCanvas();
            this.displayVideoResult(result);
        }
    }

    stopSDK() {
        this.poseLandmarker.close();
        this.poseLandmarker = null;
        this.isRunning = false;
        globalStates.setModelLoaded(false);
    }
}

export default new CameraSDK()