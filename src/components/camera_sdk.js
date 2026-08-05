
import { FilesetResolver, PoseLandmarker, DrawingUtils} from '@mediapipe/tasks-vision'
import { constants } from './constants/constants'
import {BlazePoseTask} from './tasks/blazepose_task'

class CameraSDK {
    constructor() {
        this.task = undefined;
    }

    async init() {
        switch (constants.modelToUse) {
            case 'BLAZEPOSE':
                this.task = new BlazePoseTask();
                break;
            default:
                this.task = new BlazePoseTask();
                break;
        }
        await this.task.initializeTask();
    }

    initCanvas() {
        this.task.setupCanvas();
    }

    initVideoWrapper() {
        this.task.setupVideoWrapper();
    }

    async detectStream(video, display) {
        if (this.task.toDisplay != display) {
            this.task.toggleDisplay();
        }
        await this.task.detectPose(video);
    }

    async stopSDK() {
        console.log('Stopping Camera SDK...');
        await this.task.cleanup();
        console.log('Camera SDK is stopped');
    }

    startRecording() {
        this.task.startRecording();
    }

    stopRecording() {
        return this.task.stopRecording();
    }
}

export default new CameraSDK()