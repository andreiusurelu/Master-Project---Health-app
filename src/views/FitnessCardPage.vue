<template>
    <div class="container">
        <BModal v-model="modal" :title="$t('fitnessCard.modal.title')" @ok="confirm" @cancel="cancel" :cancel-title="$t('fitnessCard.modal.cancel')">
            <p v-if="selectedExercise" v-html="$t('fitnessCard.modal.body', {title: $t(selectedExercise.title), noReps: selectedExercise.noReps})"></p>
        </BModal>
        <BCard
            v-for="item in store.exerciseList"
            :title="$t(item.title)"
            :key="item.id"
            :subtitle="$t('fitnessCard.itemSubtitle', {noReps: item.noReps})"
            variant="tonal">

            <BRow class="g-0">
                <BCol md="6">
                    <BCardBody>
                        <BCardText v-html="$t(item.description)"/>
                        <BButton variant="outline-primary" v-on:click="onSelect(item)"
                        v-bind:disabled="item.selected">
                            {{ $t('fitnessCard.modal.select') }}
                        </BButton>
                    </BCardBody>
                </BCol>
                <BCol md="6">
                    <BCardImg :src="item.img_link" alt="Image" class="rounded-0" />
                </BCol>
            </BRow>
        </BCard>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import {BCard, BCardGroup, BCardText, BButton, BCol, BRow, BCardImg, BCardBody, BModal} from 'bootstrap-vue-next'

import router from '../router'
import { constants } from '../components/constants/constants.js'
import { supabase } from '../components/client_data.js'
import CameraSDK from '../components/camera_sdk.js'

import { useFitnessStore } from '../components/states/fitness_data.js'

const store = useFitnessStore()

const onSelect = (item) => {
    if (item.selected) {
        return
    }
    selectedExercise.value = item
    modal.value = !modal.value
}

const cancel = () => {
    selectedExercise.value = null
    modal.value = !modal.value
}

const confirm = () => {
    store.setSelectedExercise(selectedExercise.value);
    router.push('/camera');
}

const modal = ref(false)
const selectedExercise = ref(null)

</script>

<style scoped>
.container {
  padding: 20px;
}

.card {
    margin-top: 10px;
    max-width: 540px;
}
</style>