<template>
    <div class="container">
        <h2>Welcome! Sign in</h2>
        <BForm @submit.prevent="submit">
            <BFormGroup id="email-group" :label="$t('email.label')" label-for="email-input">
                <BFormInput id="email-input" v-model="userData.emailAddress" type="email"
                :placeholder="$t('email.placeholder')" required :state="validateEmail"/>
                <BFormInvalidFeedback :state="validateEmail">{{ $t('email.invalidFormat') }}</BFormInvalidFeedback>
            </BFormGroup>
            <BFormGroup id="password-group" :label="$t('password.label')" label-for="password-input">
                <BFormInput id="password-input" v-model="userData.password" type="password" required/>
            </BFormGroup>
            <p class="error" v-if="errDetected">{{ $t(errMessage) }}</p>

            <BFormGroup>
                <BRow class="justify-content-between">
                    <BCol cols="auto">
                        <BLink to="/register" exact-path>{{ $t('login.noAccount') }}</BLink>
                    </BCol>
                    <BCol cols="auto">
                        <BLink to="/forgetPassword" exact-path>{{ $t('login.passwordForgot') }}</BLink>
                    </BCol>
                </BRow>
            </BFormGroup>
            <BButton variant="primary" type="submit">{{ $t('submit') }}</BButton>
        </BForm>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback, BLink, BRow, BCol } from 'bootstrap-vue-next'
import router from '../router'
import { supabase } from '../components/client_data.js'
import {constants} from '../components/constants/constants.js'
import { AuthAdminApi, AuthApiError, AuthSessionMissingError } from '@supabase/supabase-js'

const errDetected = ref(false)
const errMessage = ref('')

const userData = reactive({
    emailAddress: '',
    password: ''
})

const validateEmail = computed(() => 
    constants.emailRegex.test(userData.emailAddress))

const errorMessage = (error) => {
    if (error instanceof AuthApiError) {
        switch (error.status) {
            case 400:
                return 'login.error.400'
            case 422:
                return 'login.error.422'
            case 429:
                return 'login.error.429'
            case 500:
                return 'login.error.500'
            default:
                return 'login.error.unknown'
        }
    }
    else {
        if (error instanceof AuthSessionMissingError) {
            return 'login.error.session'
        }
        else {
            return 'login.error.unknown'
        }
    }
}


const submit = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.emailAddress,
        password: userData.password
    })

    if (error) {
        errDetected.value = true
        errMessage.value = errorMessage(error)
        console.log(error)
        return
    }
    router.push('/userForm')
}

onMounted(() => {
    supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      router.push('/userForm')
    }
  })
})

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