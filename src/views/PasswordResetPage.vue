<template>
    <div class="container">
        <h2>Password Reset Form</h2>
        <div v-if="recoveryMode">
            <BForm @submit.prevent="submit">
                <BFormGroup id="password-group" :label="$t('password.text')" label-for="password-input">
                    <BFormInput id="password-input" v-model="resetData.password" type="password" required
                        :state="validatePassword"/>
                    <BFormInvalidFeedback :state="validatePassword">{{ $t('password.reset.error.format') }}</BFormInvalidFeedback>
                </BFormGroup>
                <BFormGroup id="password-repeat-group" :label="$t('password.repeat')" label-for="repeat-password-input">
                    <BFormInput id="repeat-password-input" v-model="resetData.passwordRepeat"
                        type="password" required :state="validateRepeatPassword"/>
                    <BFormInvalidFeedback :state="validateRepeatPassword">{{ $t('password.reset.error.repeat') }}</BFormInvalidFeedback>
                </BFormGroup>

                <BButton variant="primary" type="submit">{{ $t('submit') }}</BButton>
            </BForm>
        </div>
        <div v-else>
            <div v-show="messageSent">
                {{ $t(message) }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import router from '../router/index.js'
import { supabase, authEvent, authSession } from '../components/client_data.js'
import { constants } from '../components/constants/constants.js'


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
    message.value = 'process'
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