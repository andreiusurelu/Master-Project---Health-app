<template>
    <div class="container">
        <BModal v-model="modal" title="Instructions" @ok="confirm" @cancel="cancel">
            <p><b>Before proceeding, read the following instructions:</b></p>
            <p>It is implied in this setup that you are warmed up. If not, press Cancel and proceed after being warmed up.</p>
            <p>You have to do {{ selectedExercise?.noReps }} repetitions of {{ selectedExercise?.title }}.</p>
            <p>You will have to click the record button and then position yourself in front of the camera <b>until the border color turns green</b>.</p>
            <p>You will proceed to train according to the selected exercise and do up to {{ selectedExercise?.noReps }} repetitions.</p>
            <p>When you're done, click on the record button to stop the recording session and proceed to the feedback form.</p>
            <b>By clicking Ok, you confirm that you've read the instructions.</b>
        </BModal>
        <BCard
            v-for="item in items"
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
                        v-bind:disabled="globalStates.hasExercise(item.id)">
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
import { onBeforeMount, ref } from 'vue'
import {BCard, BCardGroup, BCardText, BButton, BCol, BRow, BCardImg, BCardBody, BModal} from 'bootstrap-vue-next'
import router from '../router'
import { globalStates } from '../components/state.js'
import { constants } from '../components/constants.js'

const items = ref([
        {id: 1, name: 'abs', title: 'Abs',
            description: 'You must do some abs in order to determine your core fitness. It is recommended to position yourself sideways of your camera.',
            noReps: constants.absNo, img_link: '/img/cards/abs_image.jpg'},
        {id: 2, name: 'pushups', title: 'Pushups',
            description: 'You must do some pushups in order to determine your chest fitness. It is recommended to position yourself sideways of your camera.',
            noReps: constants.pushupsNo, img_link: '/img/cards/pushups_image.jpg'},
        {id: 3, name: 'squats', title: 'Squats',
            description: 'You must do some squats in order to determine your legs fitness. It is recommended to position yourself in front of your camera.',
            noReps: constants.squatsNo, img_link: '/img/cards/squats_image.jpg'}
    ])
const onSelect = (item) => {
    selectedExercise.value = item
    modal.value = !modal.value
}

const cancel = () => {
    selectedExercise.value = null
    modal.value = !modal.value
}

const confirm = () => {
    localStorage.setItem('selectedExercise', JSON.stringify(selectedExercise.value))
    router.push('/camera')
}

const modal = ref(false)
const selectedExercise = ref(null)


onBeforeMount(() => {
    if (!globalStates.exerciseListLoaded) {
        globalStates.exerciseListLoaded = true
    }
})
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