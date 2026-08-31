<template>
    <div class="container">
        <h3>
            {{ $t('endSurvey.title') }}
        </h3>
        <p>
            {{ $t('endSurvey.body') }}
        </p>
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