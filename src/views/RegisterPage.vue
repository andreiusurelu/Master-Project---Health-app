<template>
    <div class="container">
        <h2>Register <Form></Form></h2>
        <BForm @submit.prevent="submit">
            <BFormGroup id="email-group" label="Email address:" label-for="email-input">
                <BFormInput id="email-input" v-model="userData.emailAddress" type="email"
                placeholder="eg. joe_doe@mail.com" required :state="validateEmail"/>
                <BFormInvalidFeedback :state="validateEmail">Invalid email address format</BFormInvalidFeedback>
            </BFormGroup>
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
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import router from '../router'
import { supabase } from '../components/client_data.js'
import { globalStates } from '../components/state.js'
import { constants } from '../components/constants.js'

const userData = reactive({
    emailAddress: '',
    password: '',
    passwordRepeat: ''
})

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
        console.log(error)
        return
    }
    router.push('/userForm')
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