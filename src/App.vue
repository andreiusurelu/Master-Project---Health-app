<template>
  <div>
    <BNavbar v-if="$route.meta.topbar"
    variant="primary">
      <BNavbarToggle target="nav-collapse"/>
      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav color="white">
          <BNavItem to="/home">
            {{ $t('home') }}
          </BNavItem>
          <BNavItem to="/about">
            {{ $t('about.title') }}
          </BNavItem>
        </BNavbarNav>
        <BNavbarNav class="ms-auto mb-2 mb-lg-0">
          <BNavItemDropdown
          right size="lg" no-caret>
          <template #button-content><IBiTranslate size="lg"/></template>
          <!-- <template #button-content><IBiPersonCircle size="lg"/></template>
            <BDropdownGroup :header="$t('profile')">
              <BDropdownItem @click="signOut()">{{ $t('signOut') }}</BDropdownItem>
            </BDropdownGroup>
            <BDropdownDivider /> -->
            <BDropdownGroup :header="$t('language.title')">
              <BDropdownItem v-for="locale in $i18n.availableLocales"
              :key="`locale-${locale}`"
              :value="locale"
              @click="$i18n.locale = locale">
                {{ $t(`language.${locale}`) }}</BDropdownItem>
            </BDropdownGroup>
          </BNavItemDropdown>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>

    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import CameraSDK from './components/camera_sdk.js'
// import { supabase } from './components/client_data.js'
import { useRouter } from 'vue-router'

import {
  BNavbar,
  BNavbarNav,
  BNavbarToggle,
  BCollapse,
  BDropdownGroup,
  BNavItemDropdown,
  BDropdownItem,
  BNavItem,
  BDropdownDivider
} from 'bootstrap-vue-next'

const router = useRouter()

onMounted(async() =>{
  await CameraSDK.init()
})

// const signOut = async () => {
//     const { error } = await supabase.auth.signOut()
//     if (error) {
//         console.log(error)
//         return
//     }
//     else {
//         await CameraSDK.stopSDK()
//         router.push('/login')
//     }
// }
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
}
</style>