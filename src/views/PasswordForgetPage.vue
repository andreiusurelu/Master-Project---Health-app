<template>
    <div class="container">
        <h2>Password Recovery Form</h2>
        <BForm @submit.prevent="submit">
            <BFormGroup id="email-group" label="Email address:" label-for="email-input">
                <BFormInput id="email-input" v-model="emailAddress" type="email" placeholder="eg. joe_doe@mail.com" required "/>
            </BFormGroup>

            <BButton variant="primary" type="submit">Submit</BButton>
            <div v-show="messageSent">
                {{ message }}
            </div>
        </BForm>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import router from '../router'
import { supabase } from '../components/client_data.js'
import { globalStates } from '../components/state.js'


const emailAddress = ref('')
const message = ref('')
const messageSent = ref(false)

const submit = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(
        emailAddress.value, {
            redirectTo: `${window.location.origin}/resetPassword`
        }
    )
    if (error) {
        message.value = error.message
        console.log(error)
    }
    else {
        message.value = 'Check your email for a reset link'
    }
    messageSent.value = true
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