<template>
  <div class="container">
    <h2>User Information</h2>

    <BForm @submit.prevent="submitForm" @reset="resetForm" v-if="show">
      <BFormGroup id="age-group" :label="$t('userForm.age.label')" label-for="age-input" :description="$t('userForm.age.description', {min: constants.minAge, max: constants.maxAge})">
        <BFormInput id="age-input" v-model="form.age" type="number" :placeholder="$t('userForm.age.placeholder')" required
        :state="validateAge"/>
        <BFormInvalidFeedback :state="validateAge">
          {{ $t('userForm.age.invalid') }}
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="sex-group" :label="$t('userForm.sex.label')" label-for="sex-input" :description="$t('userForm.sex.description')">
        <BFormRadioGroup id="sex-input" v-model="form.sex" required>
          <BFormRadio value="male">
            {{ $t('userForm.sex.male') }}
          </BFormRadio>
          <BFormRadio value="female">
            {{ $t('userForm.sex.female') }}
          </BFormRadio>
        </BFormRadioGroup>
      </BFormGroup>
      <BFormGroup id="level-group" :label="$t('userForm.level.label')" label-for="level-input" :description="$t('userForm.level.description')">
        <BFormSelect id="level-input" :options="levels" v-model="form.level" required/>
      </BFormGroup>
      <BFormGroup id="weight-group" :label="$t('userForm.weight.label')" label-for="weight-input" :description="$t('userForm.weight.description')">
        <BFormInput id="weight-input" v-model="form.weight" type="number" :placeholder="$t('userForm.weight.placeholder')" required
        :state="validateWeight"/>
        <BFormInvalidFeedback :state="validateWeight">
          {{ $t('userForm.weight.invalid', {min: constants.minWeight, max: constants.maxWeight}) }}
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="height-group" :label="$t('userForm.height.label')" label-for="height-input" :description="$t('userForm.height.description')">
        <BFormInput id="height-input" v-model="form.height" type="number" :placeholder="$t('userForm.height.placeholder')" required
        :state="validateHeight"/>
        <BFormInvalidFeedback :state="validateHeight">
          {{ $t('userForm.height.invalid', {min: minHeight, max: maxHeight}) }}
        </BFormInvalidFeedback>
      </BFormGroup>
      <div class="buttons">
        <BButton type="submit" variant="primary">{{ $t('submit') }}</BButton>
        <BButton type="reset" variant="danger">{{ $t('reset') }}</BButton>
      </div>
    </BForm>
  </div>
</template>

<script setup>
import { reactive, computed, nextTick, ref } from 'vue'
import router from '../router'
import { supabase } from '../components/client_data'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback, BFormRadio, BFormRadioGroup, BFormSelect } from 'bootstrap-vue-next'
import { useI18n } from 'vue-i18n'
import { constants } from '../components/constants/constants'

const {t} = useI18n()

const levels = [
  {
    value: null, text: t('userForm.level.options.chooseOption')
  },
  {
    value: 1, text: t('userForm.level.options.beginner')
  },
  {
    value: 2, text: t('userForm.level.options.intermediary')
  },
  {
    value: 3, text: t('userForm.level.options.advanced')
  }
]

const form = reactive({
  age: '',
  sex: null,
  height: '',
  weight: '',
  level: null
})

const show = ref(true)

const validateAge = computed(() => form.age >= constants.minAge && form.age <= constants.maxAge)
const validateWeight = computed(() => form.weight >= constants.minWeight && form.weight <= constants.maxWeight)
const validateHeight = computed(() => form.height >= constants.minHeight && form.height <= constants.maxHeight)

const submitForm = async () => {
  const response = await supabase.from('UserData').upsert({
    age: form.age,
    sex: form.sex == 'male' ? 0 : 1,
    height: form.height,
    weight: form.weight,
    level: form.level
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
  form.level = null

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