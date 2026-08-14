<template>
    <div class="container">
        <p v-html="$t('endSurvey')"></p>
    </div>

</template>

<script setup>
import { onMounted } from 'vue'
import CameraSDK from '../components/camera_sdk.js'

onMounted(async() => {
    await CameraSDK.stopSDK()
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>