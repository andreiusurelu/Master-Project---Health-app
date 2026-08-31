<template>

    <div id="videoWrapper" class="video-wrapper">
        <video
        ref="videoRef"
        autoplay
        playsinline
        muted
      ></video>
      <canvas id="canvasOverlay">
      </canvas>
      <div v-show="isMobile">
        <BButton class="btn left" v-on:click="switchCamera" :disabled="isRecording">
          <IBiArrowRepeat class="icon small"/>
        </BButton>
      </div>
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
        class="btn right" v-on:click="isDisplay = !isDisplay">
        <IBiPersonArmsUp class="icon small"/>
      </BButton>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CameraSDK from '../components/camera_sdk.js'
import { BButton } from 'bootstrap-vue-next'
import { useI18n } from 'vue-i18n'

import { useFitnessStore } from '../components/states/fitness_data.js'


const router = useRouter()

const videoRef = ref(null)

const store = useFitnessStore()
const {t} = useI18n()

let stream = null
let frameCallbackHandle = null
const isRecording = ref(false)
const isDisplay = ref(true)
const isMobile = ref(false)
const isFaceCamera = ref(true)

const checkEnvironmentCamera = async () => {
  try {
    const testStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "environment" } 
      }
    });

    testStream.getTracks().forEach(track => track.stop());

    isMobile.value = true;
  }
  catch (e) {
    isMobile.value = false;
  }
}

const startCamera = async () => {
  try {

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFaceCamera.value ? 'user' : 'environment',
        width: { min: 640, ideal: 1280, max: 2550 },
        height: { min: 480, ideal: 720, max: 1440 },
        frameRate: {min: 5, ideal: 10, max: 15},
        resizeMode: 'crop-and-scale'
      }
    });

    videoRef.value.srcObject = stream;

    CameraSDK.initCanvas();

    await new Promise(resolve =>
    {
      videoRef.value.onloadedmetadata = resolve;
    }
    );

    await videoRef.value.play();

    await renderLoop();

  } catch (err) {
    if (err.name == "NotAllowedError") {
      alert(t('alert.camera.denied'))
    }
    else if (err.name == "NotFoundError"){
      alert(t('alert.camera.notFound'))
    }
    else {
      alert(t('alert.camera.error'))
    }
    console.error(err)
  }
}

const startRecording = () => {
  isRecording.value = true;
  CameraSDK.startRecording();
}

const stopRecording = () => {
  const landmarksList = CameraSDK.stopRecording();
  if (landmarksList.length > 0) {
    isRecording.value = false;
    store.setFitnessSessionData(landmarksList);
    router.push('/feedback');
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
}


const renderLoop = async (now, metadata) => {
  const video = videoRef.value
  if (video) {
    if (video.videoHeight > 0 && video.videoWidth > 0) {
      try {
        await CameraSDK.detectStream(video, isDisplay.value)
      }
      catch (error) {
        console.log(error)
      }
    }
    else {
      console.error('INVALID HEIGHT AND WIDTH')
    }
    frameCallbackHandle = video.requestVideoFrameCallback(renderLoop)
  }
}

const switchCamera = () => {
  console.log('Switching camera!');
  isFaceCamera.value = !isFaceCamera.value;
  stopCamera();
  startCamera();
}

onBeforeMount(async () => {
  console.log('Check if mobile');
  checkEnvironmentCamera();
})


onMounted(async () => {
  console.log('Setting up video wrapper');
  CameraSDK.initVideoWrapper();
  console.log('Setting up the canvas');
  CameraSDK.initCanvas();
  console.log('Starting camera');
  await startCamera();
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

video {
  z-index: 1;
}

canvas {
  z-index: 2;
  pointer-events: none; /* lets clicks go through to video */
}

.btn.right {
  width: 40px;
  height: 40px;
  left: 80%;
}

.btn.left {
  width: 40px;
  height: 40px;
  left: 20%;
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
  z-index: 2;
}

.icon {
  width: 100%;
  height: 100%;
}

.icon.small {
  width: 80%;
  height: 80%;
}
</style>