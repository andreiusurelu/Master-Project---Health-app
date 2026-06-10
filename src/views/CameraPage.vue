<template>
  <div class="container">

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
        class="btn"
        aria-label="Record"
        v-on:click="startRecording">
          <IBiRecordCircle class="icon"/>
        </BButton>
      </div>
    </div>
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
import IBi0Circle from '~icons/bi/0-circle'


const videoRef = ref(null)

let stream = null
let detectionInterval = null
const feedbackState = ref(null)
const landmarksList = ref([])
const isRecording = ref(false)
let notDetecting = true

const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    videoRef.value.srcObject = stream;

    detectionInterval = setInterval(async () => renderLoop(), constants.timeInterval)

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

  if (videoRef.value) {
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
      video.height = video.videoHeight;
      video.width = video.videoWidth;

      try {
        const predictedLandmarks = await CameraSDK.detectStream(video, true)
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
  }
}

onBeforeMount(async () => {
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
.container {
  padding: 20px;
}

.video-wrapper {
  position: relative;
  width: 1024px;
  height: 720px;
  border: 5px solid grey;
}

.buttons {
  margin-top: 15px;
}

video, canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

canvas {
  pointer-events: none; /* lets clicks go through to video */
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
  width: 50px;
  height: 50px;
}

.icon {
  width: 100%;
  height: 100%;
}
</style>