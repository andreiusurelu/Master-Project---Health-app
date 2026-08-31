<template>
  <div class="container">
    <h2>{{ $t('feedback.title') }}</h2>

    <BForm @submit.prevent="submitFeedback">
      <BFormGroup id="no-reps-group" :label="$t('feedback.noReps.label')" label-for="no-reps-input"
        :description="$t('feedback.noReps.description')">
        <BFormInput id="no-reps-input" v-model="feedback.done_reps"
        type="number" :placeholder="$t('feedback.noReps.placeholder')" required :state="validateDoneReps"/>
        <BFormInvalidFeedback :state="validateDoneReps">
          {{ $t('feedback.noReps.invalid', {noReps: store.noReps}) }}
        </BFormInvalidFeedback>
    </BFormGroup>
    <BFormGroup id ="rir-group" :label="$t('feedback.rir.label')" label-for="rir-input"
      :description="$t('feedback.rir.description')" v-if="checkReps">
      <BFormInput id="rir-input" v-model="feedback.rir" type="number"
      :placeholder="$t('feedback.rir.placeholder')" required :state="validateRIR"/>
      <BFormInvalidFeedback :state="validateRIR">
        {{ $t('feedback.rir.invalid'), {maxLimit: maxExtraReps} }}
      </BFormInvalidFeedback>
    </BFormGroup>
      <BButton type="submit" variant="primary">{{ $t('submit') }}</BButton>
    </BForm>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onBeforeMount } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import { supabase } from '../components/client_data'
import { useRouter } from 'vue-router'
import { useFitnessStore } from '../components/states/fitness_data'
import { useI18n } from 'vue-i18n'

const {t} = useI18n()
const router = useRouter()

const feedback = reactive({
  done_reps: '',
  rir: ''
})

const store = useFitnessStore()

const selectedExercise = ref(null)
const landmarksList = ref(null)


const checkReps = computed(() => feedback.done_reps == selectedExercise.value.noReps)

const maxExtraReps = 10

const validateDoneReps = computed(() => feedback.done_reps > 0 && feedback.done_reps <= selectedExercise.value.noReps)
const validateRIR = computed(() => feedback.rir > 0 && feedback.rir <= maxExtraReps)

onBeforeMount(() => {
  selectedExercise.value = store.selectedExercise;
  landmarksList.value = store.fitnessSessionData;
})

const submitFeedback = async () => {

  if (feedback.rir == '') {
    feedback.rir = 0
  }

  const response = await supabase.from('UserFitnessSession').insert({
    exerciseName: store.name,
    noReps: feedback.done_reps,
    rir: feedback.rir,
    sessionData: landmarksList.value
  })

  if (response.success) {
    alert(t('alert.form.saved'))
    store.clearSessionData();
    router.push('/cards')
  }
  else {
    alert(t('alert.form.error'))
    console.log(response)
    return
  }
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