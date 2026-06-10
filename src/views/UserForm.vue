<template>
  <div class="container">
    <h2>User Information</h2>

    <BForm @submit.prevent="submitForm" @reset="resetForm" v-if="show">
      <BFormGroup id="age-group" label="Age:" label-for="age-input" description="Your current age">
        <BFormInput id="age-input" v-model="form.age" type="number" placeholder="e.g 20 years old" required
        :state="validateAge"/>
        <BFormInvalidFeedback :state="validateAge">
          Your age should be between 10 and 99.
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="sex-group" label="Sex:" label-for="sex-input" description="Your sex">
        <BFormRadioGroup id="sex-input" v-model="form.sex" required>
          <BFormRadio value="male">
            Male
          </BFormRadio>
          <BFormRadio value="female">
            Female
          </BFormRadio>
        </BFormRadioGroup>
      </BFormGroup>
      <BFormGroup id="weight-group" label="Weight:" label-for="weight-input" description="Your current weight (in kilograms)">
        <BFormInput id="weight-input" v-model="form.weight" type="number" placeholder="e.g 80 kgs" required
        :state="validateWeight"/>
        <BFormInvalidFeedback :state="validateWeight">
          Your weight should be between 10 and 199 kilograms.
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="height-group" label="Height:" label-for="height-input" description="Your current height (in centimeters)">
        <BFormInput id="height-input" v-model="form.height" type="number" placeholder="e.g 175 cm" required
        :state="validateHeight"/>
        <BFormInvalidFeedback :state="validateHeight">
          Your weight should be between 100 and 250 centimeters.
        </BFormInvalidFeedback>
      </BFormGroup>
      <div class="buttons">
        <BButton type="submit" variant="primary">Submit</BButton>
        <BButton type="reset" variant="danger">Reset</BButton>
      </div>
    </BForm>
  </div>
</template>

<script setup>
import { reactive, computed, nextTick, ref, onBeforeMount } from 'vue'
import router from '../router'
import { supabase } from '../components/client_data'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback, BFormRadio, BFormRadioGroup } from 'bootstrap-vue-next'

const form = reactive({
  age: '',
  sex: null,
  height: '',
  weight: ''
})

const show = ref(true)

const validateAge = computed(() => form.age >= 10 && form.age <= 99)
const validateWeight = computed(() => form.weight >= 10 && form.weight <= 199)
const validateHeight = computed(() => form.height >= 100 && form.height <= 250)

onBeforeMount(async () => {
  try {
    const { data, error, status } = await supabase.from('UserData').select("*")
    if (error && status !== 406) {
      throw error
    }

    if (data !== null && status == 200) {
      router.push('/cards')
    }
  }
  catch (error) {
    console.log(error)
    alert('Error when checking user form!')
  }
  
})

const submitForm = async () => {
  const response = await supabase.from('UserData').upsert({
    age: form.age,
    sex: form.sex == 'male' ? 0 : 1,
    height: form.height,
    weight: form.weight
  }, {
    onConflict: 'userId'
  })
  if (response.success) {
    alert('Form was saved!')
    router.push('/cards')
  }
  else {
    alert('Error on form!')
    console.log(response)
  }
}

const resetForm = () => {
  form.age = ''
  form.height = ''
  form.sex = null
  form.weight = ''

  show.value = false
  nextTick(() => {
    show.value = true
  })
}
</script>

<style scoped>
.container {
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}

input,
select {
  margin-bottom: 12px;
  padding: 10px;
}

.buttons {
  margin-top: 15px;
}

button {
  margin-top: 10px;
  margin-right: 10px;
  padding: 10px;
}
</style>