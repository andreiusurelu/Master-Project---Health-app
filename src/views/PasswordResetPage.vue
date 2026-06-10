<template>
    <div class="container">
        <h2>Password Reset Form</h2>
        <div v-if="recoveryMode">
            <BForm @submit.prevent="submit">
                <BFormGroup id="password-group" label="Password:" label-for="password-input">
                    <BFormInput id="password-input" v-model="resetData.password" type="password" required
                        :state="validatePassword"/>
                    <BFormInvalidFeedback :state="validatePassword">Password must be between 8 and 24 characters and have at least one number and one letter.</BFormInvalidFeedback>
                </BFormGroup>
                <BFormGroup id="password-repeat-group" label="Repeat password:" label-for="repeat-password-input">
                    <BFormInput id="repeat-password-input" v-model="resetData.passwordRepeat"
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
import { ref, reactive, computed, watch } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import router from '../router/index.js'
import { supabase, authEvent, authSession } from '../components/client_data.js'
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
const recoverySession = ref(null)

watch (authEvent, (event) => {
    if (event == 'PASSWORD_RECOVERY') {
        recoveryMode.value = true
        recoverySession.value = authSession.value
    }
    else if (event == 'USER_UPDATED') {
        signOut()
    }
  }, {immediate: true})

const submit = async () => {
    await supabase.auth.setSession({
        access_token: recoverySession.value.access_token,
        refresh_token: recoverySession.value.refresh_token
    })
    const { data, error } = await supabase.auth.updateUser({
        password: resetData.password
    })
    console.log('update result:', data, error)
    message.value = 'Processing...'
    messageSent.value = true
}

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        return
    }
    else {
        router.push('/login')
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
  max-width: 400px;
}

button {
    margin-top: 20px;
}
</style>