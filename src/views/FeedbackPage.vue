<template>
  <div class="container">
    <h2>Feedback Form</h2>

    <BForm @submit.prevent="submitFeedback">
      <BFormGroup id="no-reps-group" label="Number of reps:" label-for="no-reps-input"
        description="How many repetitions have you completed?">
        <BFormInput id="no-reps-input" v-model="feedback.done_reps"
        type="number" placeholder="eg. 20" required :state="validateDoneReps"/>
        <BFormInvalidFeedback :state="validateDoneReps">
          You should have completed between 1 and {{ selectedExercise.noReps }} repetitions.
        </BFormInvalidFeedback>
    </BFormGroup>
    <BFormGroup id ="rir-group" label="Extra number of reps:" label-for="rir-input"
      description="How many extra repetitions can you still do?" v-if="checkReps">
      <BFormInput id="rir-input" v-model="feedback.rir" type="number"
      placeholder="eg. 5 more" required :state="validateRIR"/>
      <BFormInvalidFeedback :state="validateRIR">
        You should have completed between 1 and 10 repetitions.
      </BFormInvalidFeedback>
    </BFormGroup>
      <BButton type="submit">Submit</BButton>
    </BForm>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import { globalStates } from '../components/state'
import { supabase } from '../components/client_data'
import router from '../router'
import CameraSDK from '../components/camera_sdk'

const feedback = reactive({
  done_reps: '',
  rir: ''
})


const selectedExercise = JSON.parse(localStorage.getItem('selectedExercise'))

const checkReps = computed(() => feedback.done_reps == selectedExercise.noReps)

const validateDoneReps = computed(() => feedback.done_reps > 0 && feedback.done_reps <= selectedExercise.noReps)
const validateRIR = computed(() => feedback.rir > 0 && feedback.rir <= 10)

const submitFeedback = async () => {
  if (globalStates.exerciseListLoaded) {
    globalStates.addExercise(selectedExercise.id)
  }
  const landmarksList = JSON.parse(localStorage.getItem('landmarksList'))
  localStorage.setItem(
    'feedback',
    JSON.stringify({exercise: selectedExercise.name, feedback: feedback})
  )

  if (feedback.rir == '') {
    feedback.rir = 0
  }

  const response = await supabase.from('UserFitnessSession').insert({
    exerciseName: selectedExercise.name,
    noReps: feedback.done_reps,
    rir: feedback.rir,
    sessionData: landmarksList
  })
  if (response.success) {
    alert('Form was saved!')
    router.push('/cards')
  }
  else {
    alert('Error on form!')
    console.log(response)
    return
  }
  if(globalStates.isExerciseListFull()) {
    CameraSDK.stopSDK()
    alert('All done!')
  }
  else {
    router.push('/cards')
  }

  alert('Feedback submitted')
}
</script>

<style scoped>
.container {
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
}

input,
textarea {
  margin-bottom: 12px;
  padding: 10px;
}

button {
  padding: 10px;
}
</style>