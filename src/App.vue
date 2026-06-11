<template>
  <div>
    <nav v-if="!$route.meta.fullscreen">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import CameraSDK from '../components/camera_sdk.js'

onMounted(async() =>{
  await CameraSDK.init()
  globalStates.setModelLoaded(true)
})
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
}

nav {
  padding: 16px;
  background: #42b883;
}

nav a {
  color: white;
  margin-right: 10px;
  text-decoration: none;
}
</style>