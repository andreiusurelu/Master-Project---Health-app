<template>

    <div class="video-wrapper" :style="{borderColor: borderColor}">
        <video
        ref="videoRef"
        autoplay
        playsinline
        muted
      ></video>
      <canvas id="canvasOverlay">
      </canvas>
      <div v-if="isRecording">
        <BButton
        variant="danger"
        class="btn"
        aria-label="Record-Stop"
        v-on:click="stopRecording">
          <IBiStopCircle class="icon"/>
        </BButton>
      </div>
      <div v-else>
        <BButton
        variant="secondary"
        aria-label="Record"
        v-on:click="startRecording">
          <IBiRecordCircle class="icon"/>
        </BButton>
      </div>
      <BButton
        :variant="isDisplay ? 'secondary' : 'primary'" aria-label="DrawSwitch"
        style="left: 80%; width: 40px; height: 40px;" v-on:click="isDisplay = !isDisplay">
        <IBiPersonArmsUp class="icon" style="width: 80%; height: 80%;"/>
      </BButton>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref, computed } from 'vue'
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision'
import CameraSDK from '../components/camera_sdk.js'
import { BButton } from 'bootstrap-vue-next'
import router from '../router'
import { globalStates } from '../components/state.js'
import { constants } from '../components/constants.js'


const videoRef = ref(null)

let stream = null
let detectionInterval = null
let frameCallbackHandle = null
const feedbackState = ref(null)
const landmarksList = ref([])
const isRecording = ref(false)
const isDisplay = ref(true)
let notDetecting = true

const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { min: 640, ideal: 1280, max: 2550 },
        height: { min: 480, ideal: 720, max: 1440 },
        frameRate: {min: 5, ideal: 10, max: 15},
        resizeMode: 'crop-and-scale'
      }
    });

    videoRef.value.srcObject = stream;

    CameraSDK.setupCanvas()

    await renderLoop()

  } catch (err) {
    alert('Camera permission denied')
  }
}

const startRecording = () => {
  isRecording.value = true
}

const stopRecording = () => {
  if (isRecording.value && landmarksList.value.length > 0) {
    localStorage.setItem('landmarksList', JSON.stringify(landmarksList.value))
    isRecording.value = false
    router.push('/feedback')
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }

  if (videoRef.value && frameCallbackHandle) {
    videoRef.value.cancelVideoFrameCallback(frameCallbackHandle)
    videoRef.value.srcObject = null
  }
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }
}

const borderColor = computed(() => {
  switch (feedbackState.value) {
    case globalStates.detectionState['NO_HISTORY']:
      return 'grey'
    case globalStates.detectionState['MOVE']:
      return 'red'
    case globalStates.detectionState['VISIBLE']:
      return 'green'
    default:
      return 'grey'
  }
})


const renderLoop = async () => {
  const video = videoRef.value
  if (video) {
    if (video.videoHeight > 0 && video.videoWidth > 0) {
      try {
        const predictedLandmarks = await CameraSDK.detectStream(video, isDisplay.value)
        const cameraState = CameraSDK.checkPreviousLandmarks()
        feedbackState.value = cameraState == null ? globalStates.detectionState['NO_HISTORY'] : cameraState;
        feedbackState.value = cameraState
        if (predictedLandmarks && isRecording.value && cameraState == globalStates.detectionState['VISIBLE']) {
          landmarksList.value.push(predictedLandmarks)
        }
      }
      catch (error) {
        console.log(error)
      }
    }
    else {
      console.log('INVALID HEIGHT AND WIDTH')
    }
    frameCallbackHandle = video.requestVideoFrameCallback(renderLoop)
  }
}

onBeforeMount(async () => {
  // in case we still haven't loaded the model
  if (!globalStates.modelLoaded) {
    await CameraSDK.init()
    globalStates.setModelLoaded(true)
  }
})

onMounted(async () => {
  console.log('Starting camera')
  await startCamera()
})

onUnmounted(() => {
  console.log('Stopping camera')
  stopCamera()
})
</script>

<style scoped>

.video-wrapper {
  position: fixed;
  min-width: 100%;
  min-height: 100%;
  top: 50%;
  left: 50%;
  width: auto;
  height: auto;
  z-index: -100;
  transform: translateX(-50%) translateY(-50%);
  border: 10px solid red;
  overflow: hidden;
}

.buttons {
  margin-top: 15px;
}

video, canvas {
  object-fit: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
}

canvas {
  pointer-events: none; /* lets clicks go through to video */
}

.btn .right {
  width: 40px;
  height: 40px;
  left: 80%;
}

.btn {
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
}

.icon {
  width: 100%;
  height: 100%;
}
</style>