<template>
    <div class="container">
        <h2>Welcome! Sign in</h2>
        <BForm @submit.prevent="submit">
            <BFormGroup id="email-group" label="Email address:" label-for="email-input">
                <BFormInput id="email-input" v-model="userData.emailAddress" type="email"
                placeholder="eg. joe_doe@mail.com" required :state="validateEmail"/>
                <BFormInvalidFeedback :state="validateEmail">Invalid email address format</BFormInvalidFeedback>
            </BFormGroup>
            <BFormGroup id="password-group" label="Password:" label-for="password-input">
                <BFormInput id="password-input" v-model="userData.password" type="password" required/>
            </BFormGroup>

            <BFormGroup>
                <BRow class="justify-content-between">
                    <BCol cols="auto">
                        <BLink to="/register" exact-path>No account?</BLink>
                    </BCol>
                    <BCol cols="auto">
                        <BLink to="/forgetPassword" exact-path>Forgot password?</BLink>
                    </BCol>
                </BRow>
            </BFormGroup>
            <BButton variant="primary" type="submit">Submit</BButton>
        </BForm>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback, BLink, BRow, BCol } from 'bootstrap-vue-next'
import router from '../router'
import { supabase } from '../components/client_data.js'
import { globalStates } from '../components/state.js'
import {constants} from '../components/constants.js'


const userData = reactive({
    emailAddress: '',
    password: ''
})

const validateEmail = computed(() => 
    constants.emailRegex.test(userData.emailAddress))


const submit = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.emailAddress,
        password: userData.password
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