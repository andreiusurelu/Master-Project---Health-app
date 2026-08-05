import {DrawingUtils, PoseLandmarker} from '@mediapipe/tasks-vision'
import {constants} from '../constants/constants';
import {BaseTask} from './base_task'

export class BlazePoseTask extends BaseTask {

    constructor() {
        super();
        this.drawingUtils = null;
        this.indices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26];
        this.indicesGroups = [[11, 12], [13, 14], [15, 16], [23, 24], [25, 26]];
    }

    async initializeTask() {
        if (!this.worker) {
            this.worker = new Worker(new URL('../workers/blazepose_worker.js', import.meta.url), {
                type: 'module'
            });
            this.worker.onmessage = this.handleWorkerMessage.bind(this);
            this.worker.onerror = (e) => {
                console.error('Worker error: ', e);
            }
            this.worker.onerrormessage = (e) => {
                console.error('Worker message error: ', e);
            }
        }
        await super.initializeTask();
    }

    setupCanvas() {
        super.setupCanvas();
        if (this.canvasCtx) {
            this.drawingUtils = new DrawingUtils(this.canvasCtx);
        }
        else {
            console.error('Failed to get canvasCtx')
            throw new Error('setupCanvas')
        }
    }

    checkVisbilitySideways(landmarks) {
        return this.indicesGroups.every(group => group.some(i => (landmarks[i]?.visibility ?? 0) > constants.visibilityThreshold))
    }

    checkVisibilityFront(landmarks) {
        this.indices.filter(i => landmarks[i].visibility > constants.visibilityThreshold).length == this.indices.length
    }

    checkPreviousLandmarks() {
        if (this.previousLandmarks) {
            const landmarks = this.previousLandmarks.landmarks[0]
            try {
                if (this.checkVisibilityFront(landmarks) || this.checkVisbilitySideways(landmarks)) {
                    return this.detectionState['VISIBLE']
                }
                else {
                    return this.detectionState['MOVE']
                }
            }
            catch (e) {
                console.log('Error: ', e, '; previous landmarks: ', this.previousLandmarks)
                return this.detectionState['NO_HISTORY']
            }
        }
        else
            return this.detectionState['NO_HISTORY']
    }

    displayVideoResult(result) {

        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);


        this.canvasCtx.beginPath();
        this.canvasCtx.rect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasCtx.clip();

        if (result.landmarks) {

            for (const landmark of result.landmarks) {
                this.drawingUtils.drawLandmarks(landmark, {
                radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
                });
                this.drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            }
        }
        this.canvasCtx.restore();
        this.toClean = true;
    }

    extractLandmarks(result) {
        if (result.landmarks.length < 1) {
            console.log('Result does not have any landmarks.');
            throw new Error('extractLandmarks');
        }
        else {
            return JSON.stringify(result.landmarks[0]);
        }
    }
}