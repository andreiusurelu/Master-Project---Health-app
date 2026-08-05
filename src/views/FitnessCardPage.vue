<template>
    <div class="container">
        <BModal v-model="modal" title="Instructions" @ok="confirm" @cancel="cancel">
            <p><b>Before proceeding, read the following instructions:</b></p>
            <p>It is implied in this setup that you are warmed up. If not, press Cancel and proceed after being warmed up.</p>
            <p>You have to do {{ selectedExercise?.noReps }} repetitions of {{ selectedExercise?.title }}.</p>
            <p>You will have to click the record button and then position yourself in front of the camera <b>until the border color turns green</b>.</p>
            <p>You will proceed to train according to the selected exercise and do up to {{ selectedExercise?.noReps }} repetitions.</p>
            <p>When you're done, click on the record button to stop the recording session and proceed to the feedback form.</p>
            <p><b>By clicking Ok, you confirm that you've read the instructions.</b></p>
        </BModal>
        <BCard
            v-for="item in store.exerciseList"
            :title="item.title"
            :key="item.id"
            :subtitle="'Number of reps: ' + item.noReps"
            variant="tonal">

            <BRow class="g-0">
                <BCol md="6">
                    <BCardBody>
                        <BCardText>
                            {{ item.description }}
                        </BCardText>
                        <BButton variant="outline-primary" v-on:click="onSelect(item)"
                        v-bind:disabled="item.selected">
                            Select
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