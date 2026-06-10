<template>
    <div class="container">
        <h2>Password Reset Form</h2>
        <div v-if="recoveryMode">
            <BForm @submit.prevent="submit">
                <BFormGroup id="password-group" label="Password:" label-for="password-input">
                    <BFormInput id="password-input" v-model="userData.password" type="password" required
                        :state="validatePassword"/>
                    <BFormInvalidFeedback :state="validatePassword">Password must be between 8 and 24 characters and have at least one number and one letter.</BFormInvalidFeedback>
                </BFormGroup>
                <BFormGroup id="password-repeat-group" label="Repeat password:" label-for="repeat-password-input">
                    <BFormInput id="repeat-password-input" v-model="userData.passwordRepeat"
                        type="password" required :state="validateRepeatPassword"/>
                    <BFormInvalidFeedback :state="validateRepeatPassword">Password doesn't match</BFormInvalidFeedback>
                </BFormGroup>

                <BButton variant="primary" type="submit">Submit</BButton>
            </BForm>
        </div>
        <div v-else>
            <div v-show="messageSent">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import router from '../router/index.js'
import { supabase } from '../components/client_data.js'
import { globalStates } from '../components/state.js'
import { constants } from '../components/constants.js'


const resetData = reactive({
    password: '',
    passwordRepeat: ''
})

const message = ref('')
const messageSent = ref(false)

const validatePassword = computed(() => constants.passwordRegex.test(resetData.password))

const validateRepeatPassword = computed(() => resetData.passwordRepeat === resetData.password)

const recoveryMode = ref(false)

onMounted(() => {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      recoveryMode.value = true
    }
  })
})

const submit = async () => {
    const { error } = await supabase.auth.updateUser({
        password: password.value
    })
    if (error) {
        message.value = error
        return
    }
    message.value = 'Check your email for a reset link'
    messageSent.value = true

    supabase.auth.onAuthStateChange((event) => {
    if (event === 'USER_UPDATED') {
      router.push('/login')
    }
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

button {
    margin-top: 20px;
}
</style>