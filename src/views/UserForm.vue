<template>
  <div class="container">
    <h2>{{ $t('userForm.title') }}</h2>

    <BForm @submit.prevent="submitForm" @reset="resetForm" v-if="show">
      <BFormGroup id="age-group" :label="$t('userForm.age.label')" label-for="age-input" :description="$t('userForm.age.description')">
        <BFormInput id="age-input" v-model="store.age" type="number" :placeholder="$t('userForm.age.placeholder')" required
        :state="store.validateAge"/>
        <BFormInvalidFeedback :state="store.validateAge">
          {{ $t('userForm.age.invalid', {min: constants.minAge, max: constants.maxAge}) }}
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="sex-group" :label="$t('userForm.sex.label')" label-for="sex-input" :description="$t('userForm.sex.description')">
        <BFormRadioGroup id="sex-input" v-model="store.sex" required>
          <BFormRadio v-for="sex in sexes" :key="sex.value" :value="sex.value">
            {{ $t(sex.text) }}
          </BFormRadio>
        </BFormRadioGroup>
      </BFormGroup>
      <BFormGroup id="level-group" :label="$t('userForm.level.label')" label-for="level-input" :description="$t('userForm.level.description')">
        <BFormSelect id="level-input" v-model="store.level" required>
          <BFormSelectOption v-for="level in levels" :key="level.value" :value="level.value">
            {{ $t(level.text) }}
          </BFormSelectOption>
        </BFormSelect>
      </BFormGroup>
      <BFormGroup id="weight-group" :label="$t('userForm.weight.label')" label-for="weight-input" :description="$t('userForm.weight.description')">
        <BFormInput id="weight-input" v-model="store.weight" type="number" :placeholder="$t('userForm.weight.placeholder')" required
        :state="store.validateWeight"/>
        <BFormInvalidFeedback :state="store.validateWeight">
          {{ $t('userForm.weight.invalid', {min: constants.minWeight, max: constants.maxWeight}) }}
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="height-group" :label="$t('userForm.height.label')" label-for="height-input" :description="$t('userForm.height.description')">
        <BFormInput id="height-input" v-model="store.height" type="number" :placeholder="$t('userForm.height.placeholder')" required
        :state="store.validateHeight"/>
        <BFormInvalidFeedback :state="store.validateHeight">
          {{ $t('userForm.height.invalid', {min: constants.minHeight, max: constants.maxHeight}) }}
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
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../components/client_data'
import { useI18n } from 'vue-i18n'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback, BFormRadio, BFormRadioGroup, BFormSelect, BFormSelectOption } from 'bootstrap-vue-next'
import sexes from '../components/constants/sexes.json' with {type: 'json'}
import levels from '../components/constants/levels.json' with {type: 'json'}
import { constants } from '../components/constants/constants'
import { useFormData } from '../components/states/user_form'

const router = useRouter()
const store = useFormData()
const {t} = useI18n()

const show = ref(true)

const submitForm = async () => {
  if (store.validForm) {
    const response = await supabase.from('UserData').upsert({
      age: store.age,
      sex: store.sex,
      height: store.height,
      weight: store.weight,
      level: store.level
    }, {
      onConflict: 'userId'
    })
    if (response.success) {
      alert(t('alert.form.saved'))
      router.push('/cards')
    }
    else {
      alert(t('alert.form.error'))
      console.log(response)
    }
  }
}

const resetForm = () => {
  store.$reset()

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