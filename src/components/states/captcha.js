import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCaptchaStore = defineStore('captcha-state', () => {
    const captchaToken = ref('')
    const captcha = ref(null)
    const verified = ref(false)
    const expired = ref(false)
    const eKey = ref('')
    const error = ref(null)

    function submit() {
        if (captcha.value == null) {
            console.log('Captcha is null');
        }
        else {
            captcha.value.execute();
        }
    }

    function setCaptcha(captchaObj) {
        captcha.value = captchaObj
    }

    function setVerified(token, ekey) {
        verified.value = true;
        captchaToken.value = token;
        eKey.value = ekey;

    }

    function setExpired() {
        expired.value = true;
        verified.value = false;
        captchaToken.value = '';
        eKey.value = '';
    }

    function setError(err) {
        captchaToken.value = '';
        eKey.value = '';
        error.value = err;
        verified.value = false;
    }

    function resetCaptcha() {
        captcha.value = null;
        captchaToken.value = '';
        eKey.value = '';
        verified.value = false;
        expired.value = false;
        error.value = null;
    }

    function $reset() {
        resetCaptcha();
    }

    return {captchaToken, eKey, captcha, verified, expired, error, setCaptcha, submit, setVerified, setExpired, setError, resetCaptcha, $reset}
})