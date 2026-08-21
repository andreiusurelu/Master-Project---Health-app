<template>
    <div class="container">
        <h2>{{ $t('register.title') }}</h2>
        <BForm @submit.prevent="submit">
            <BFormGroup id="email-group" :label="$t('email.label')" label-for="email-input">
                <BFormInput id="email-input" v-model="userData.emailAddress" type="email"
                :placeholder="$t('email.placeholder')" required :state="validateEmail"/>
                <BFormInvalidFeedback :state="validateEmail">{{ $t('email.invalidFormat') }}</BFormInvalidFeedback>
            </BFormGroup>
            <BFormGroup id="password-group" :label="$t('password.label')" label-for="password-input">
                <BFormInput id="password-input" v-model="userData.password" type="password" required
                    :state="validatePassword"/>
                <BFormInvalidFeedback :state="validatePassword">{{ $t('register.error.password') }}</BFormInvalidFeedback>
            </BFormGroup>
            <BFormGroup id="password-repeat-group" :label="$t('password.repeat')" label-for="repeat-password-input">
                <BFormInput id="repeat-password-input" v-model="userData.passwordRepeat"
                    type="password" required :state="validateRepeatPassword"/>
                <BFormInvalidFeedback :state="validateRepeatPassword">{{ $t('register.error.passwordRepeat') }}</BFormInvalidFeedback>
            </BFormGroup>
            <p class="error" v-show="errDetected">{{ $t(errMessage) }}</p>
            <p  class="info" v-show="showMessage">{{ $t(message) }}</p>
            <BButton variant="primary" type="submit">{{ $t('submit') }}</BButton>
        </BForm>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import router from '../router'
import { supabase } from '../components/client_data.js'
import { constants } from '../components/constants/constants.js'

const userData = reactive({
    emailAddress: '',
    password: '',
    passwordRepeat: ''
})

const errDetected = ref(false)
const errMessage = ref('')

const showMessage = ref(false)
const message = ref('')

const errorMessage = (error) => {
    if (error instanceof AuthApiError) {
        switch (error.status) {
            case 400:
                return 'register.error.400'
            case 422:
                return 'register.error.422'
            case 429:
                return 'register.error.429'
            case 500:
                return 'register.error.500'
            default:
                return 'register.error.unknown'
        }
    }
    else {
        if (error instanceof AuthSessionMissingError) {
            return 'register.error.session'
        }
        else {
            return 'register.error.unknown'
        }
    }
}

const validateEmail = computed(() => 
    constants.emailRegex.test(userData.emailAddress))

const validatePassword = computed(() => constants.passwordRegex.test(userData.password))

const validateRepeatPassword = computed(() => userData.passwordRepeat === userData.password)

const submit = async () => {
    const { data, error } = await supabase.auth.signUp({
        email: userData.emailAddress,
        password: userData.password,
    })
    if (error) {
        errDetected.value = true
        errMessage.value = errorMessage(error)
        console.log(error)
        return
    }
    else {
        showMessage.value = true
        message.value = 'register.emailCheck'
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
  max-width: 400px;
}

button {
    margin-top: 20px;
}

.error {
    color: red;
}
</style>