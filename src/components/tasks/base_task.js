import { time } from "@tensorflow/tfjs";

export class BaseTask {
    detectionState = {NO_HISTORY: 0, MOVE: 1, VISIBLE: 2};
    constructor() {
        this.worker = undefined;
        this.canvasElement = undefined;
        this.videoWrapper = undefined;
        this.canvasCtx = null;
        this.toClean = false;
        this.previousLandmarks = null;
        this.isWorkerReady = false;
        this.toDisplay = false;
        this.isDetecting = false;
        this.isRecording = false;
        this.recordedLandmarks = [];
    }

    async initializeTask() {
        if (this.worker) {
            console.log('Inside BaseTask initializeTask()')
            this.worker.postMessage({type: 'INIT'})
        }
    }

    setVideoSize(width, height) {
        if (this.canvasElement.width != width || this.canvasElement.height != height) {
            this.canvasElement.width = width;
            this.canvasElement.height = height;
        }
    }

    setupCanvas() {
        this.canvasElement = document.getElementById('canvasOverlay');
        if (this.canvasElement) {
            this.canvasCtx = this.canvasElement.getContext('2d');
        }
        else {
            console.error("Couldn't find canvasOverlay");
            throw new Error('setupCanvas')
        }
    }

    setupVideoWrapper() {
        this.videoWrapper = document.getElementById('videoWrapper');
        if (this.videoWrapper) {

        }
        else {
            console.error("Couldn't find videoWrapper");
            throw new Error('videoWrapper');
        }
    }

    setVideoWrapperBorderColor(state) {
        switch (state) {
            case this.detectionState['VISIBLE']:
                this.videoWrapper.style.borderColor = 'green';
                break;
            case this.detectionState['MOVE']:
                this.videoWrapper.style.borderColor = 'red';
                break;
            default:
                this.videoWrapper.style.borderColor = 'grey';
                break;
        }
    }

    setPreviousLandmarks(previousLandmarks) {
        this.previousLandmarks = previousLandmarks;
    }

    getPreviousLandmarks() {
        return this.previousLandmarks;
    }

    checkPreviousLandmarks() {}

    checkVisibilityFront(landmarks) {}

    checkVisibilitySideways(landmarks) {}

    displayVideoResult(result) {}

    extractLandmarks(result) {}

    async cleanup() {
        if (this.worker) {
            this.worker.postMessage({ type: 'CLEANUP' });
            this.worker.terminate();
            this.worker = undefined;
        }
        this.isWorkerReady = false;
    }

    toggleDisplay() {
        this.toDisplay = !this.toDisplay;
    }

    async detectPose(video) {
        if (this.isWorkerReady && !this.isDetecting) {
            this.isDetecting = true;
            this.setVideoSize(video.videoWidth, video.videoHeight);
            const vidBitmap = await window.createImageBitmap(video);
            this.worker.postMessage({ type: 'DETECT_POSE', vidBitmap: vidBitmap });
        }
    }

    cleanDisplay() {
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.toClean = false;
    }

    handleWorkerMessage(event) {
        const {type} = event.data;

        switch (type) {
            case 'INIT_DONE': {
                this.isWorkerReady = true;
                break;
            }
            case 'DETECT_RESULT': {
                const {inferenceTime, timestamp, result} = event.data;
                if (this.toDisplay) {
                    this.displayVideoResult(result);
                }
                else if (this.toClean) {
                    this.cleanDisplay();
                }
                const state = this.checkPreviousLandmarks();
                this.setVideoWrapperBorderColor(state);
                if (this.isRecording && state == this.detectionState['VISIBLE']) {
                    this.recordedLandmarks.push({timestamp: timestamp, landmarks: this.extractLandmarks(result)})
                }
                this.isDetecting = false;
                this.previousLandmarks = result;
                break;
            }
            case 'DETECT_NO_POSE': {
                console.log('Failed to detect a person on camera!')
                this.isDetecting = false;
                this.setVideoWrapperBorderColor(this.detectionState['MOVE']);
                break;
            }
            case 'CLEANUP_DONE': {
                console.log('Cleanup done');
                break;
            }
            case 'DETECT_ERROR': {
                const {err} = event.data;
                console.error('Error from model: ', err);
                const state = this.checkPreviousLandmarks();
                this.setVideoWrapperBorderColor(state);
                this.isDetecting = false;
                break;
            }
            case 'WORKER_ERROR': {
                const {err} = event.data;
                console.error('Error from worker: ', err);
                this.isDetecting = false;
                break;
            }
        }
    }

    startRecording() {
        this.isRecording = true;
        this.recordedLandmarks = [];
    }

    stopRecording() {
        this.isRecording = false;
        return this.recordedLandmarks;
    }
}