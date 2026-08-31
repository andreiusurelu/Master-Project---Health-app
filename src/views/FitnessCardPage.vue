<template>
    <div class="container">
        <BModal v-if="selectedExercise" v-model="modal" :title="$t('fitnessCard.modal.title')" @ok="confirm" @cancel="cancel" :cancel-title="$t('fitnessCard.modal.cancel')">
            <p><b>{{ $t('fitnessCard.modal.body.beforeProceed') }}</b></p>
            <p>{{ $t('fitnessCard.modal.body.imply') }}</p>
            <p>{{ $t('fitnessCard.modal.body.firstInstruction', {title: $t(selectedExercise.title), noReps: selectedExercise.noReps}) }}</p>
            <p>{{ $t('fitnessCard.modal.body.secondInstruction') }} <b>{{ $t('fitnessCard.modal.body.secondInstructionContinue') }}</b></p>
            <p>{{ $t('fitnessCard.modal.body.thirdInstruction', {noReps: selectedExercise.noReps}) }}</p>
            <p>{{ $t('fitnessCard.modal.body.fourthInstruction') }}</p>
            <p><b>{{ $t('fitnessCard.modal.body.confirm') }}</b></p>
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
                        <BCardText>
                            {{ $t(item.description.firstInstruction) }} <b>{{ $t(item.description.secondInstruction) }}</b>
                        </BCardText>
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
import { ref } from 'vue'
import {BCard, BCardText, BButton, BCol, BRow, BCardImg, BCardBody, BModal} from 'bootstrap-vue-next'
import { useRouter } from 'vue-router'

import { useFitnessStore } from '../components/states/fitness_data.js'

const store = useFitnessStore()
const router = useRouter()

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