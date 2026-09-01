<template>
    <div class="container">
        <h2>{{ $t('greeting.title') }}</h2>
        <p>
            {{ $t('greeting.body') }}
        </p>
        <vue-hcaptcha :sitekey="constants.sitekey" size="invisible" @verify="onVerify" @rendered="onRendered" @executed="onExecuted"
        @expired="onExpire" @opened="onOpened" @challenge-expired="onChallengeExpired" @error="onError" @load="onLoad" :ref="store.setCaptcha"/>
        <BButton v-if="isLoading" disabled variant="primary">
            <BSpinner small />
            {{ $t('process') }}
        </BButton>
        <BButton v-else variant="primary" type="submit" @click="proceed">{{ $t('start') }}</BButton>
    </div>

</template>

<script setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { BButton, BSpinner } from 'bootstrap-vue-next'
import { constants } from '../components/constants/constants'
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useCaptchaStore } from '../components/states/captcha';
import { supabase } from '../components/client_data';

const store = useCaptchaStore();
const isLoading = ref(false);

const router = useRouter();

const proceed = () => {
    isLoading.value = true;
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
        console.error(error);
        isLoading.value = false;
    }
}

const onExpire = () => {
    store.setExpired();
    console.log('Expired');
    isLoading.value = false;
}

const onChallengeExpired = () => {
    store.setExpired();
    console.log('Challenge expired');
    isLoading.value = false;
}

const onError = (err) => {
    if (err == 'network-error' && store.maxRetries > 0) {
        store.retry()
    }
    else {
        store.setError(err);
        console.log(`Error: ${err}`);
        isLoading.value = false;
    }
}

const onRendered = () => {
    console.log('Captcha was rendered')
}

const onExecuted = () => {
    console.log('Captcha was executed')
}

const onOpened = () => {
    console.log('Captcha was opened')
}

const onLoad = () => {
    console.log('Captcha was loaded')
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