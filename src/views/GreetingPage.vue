<template>
    <div class="container">
        <h2>{{ $t('greeting.title') }}</h2>
        <p>
            {{ $t('greeting.body') }}
        </p>
        <vue-hcaptcha :sitekey="constants.sitekey" size="invisible" @verify="onVerify"
        @expired="onExpire" @challenge-expired="onChallengeExpired" @error="onError" :ref="store.setCaptcha"/>
        <BButton variant="primary" type="submit" @click="proceed">{{ $t('start') }}</BButton>
    </div>

</template>

<script setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { BButton } from 'bootstrap-vue-next'
import { constants } from '../components/constants/constants'
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useCaptchaStore } from '../components/states/captcha';
import { supabase } from '../components/client_data';

const store = useCaptchaStore();

const router = useRouter()

const proceed = () => {
    store.submit();
}

const onVerify = async (tokenStr, ekey) => {
    store.setVerified(tokenStr, ekey);
    console.log('Verified');
    const {data, error} = await supabase.auth.signInAnonymously({
        options: {
            captchaToken: store.captchaToken
        }
    });
    if (error) {
        console.error(error)
    }
}

const onExpire = () => {
    store.setExpired();
    console.log('Expired');
}

const onChallengeExpired = () => {
    store.setExpired();
    console.log('Challenge expired');
}

const onError = (err) => {
    store.setError(err);
    console.log(`Error: ${err}`);
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
  padding-top: 10%;
  text-align: center;
}
</style>