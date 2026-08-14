<template>
    <div class="container">
        <h2>Password Recovery Form</h2>
        <BForm @submit.prevent="submit">
            <BFormGroup id="email-group" :label="$t('email.label')" label-for="email-input">
                <BFormInput id="email-input" v-model="emailAddress" type="email" :placeholder="$t('email.placeholder')" required "/>
            </BFormGroup>

            <BButton variant="primary" type="submit">{{ $t('submit') }}</BButton>
            <div v-show="messageSent">
                {{ $t(message) }}
            </div>
        </BForm>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { BButton, BForm, BFormInput, BFormGroup, BFormInvalidFeedback } from 'bootstrap-vue-next'
import router from '../router'
import { supabase } from '../components/client_data.js'


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
        message.value = 'password.reset.error.sendEmail'
        console.log(error)
    }
    else {
        message.value = 'password.reset.emailCheck'
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