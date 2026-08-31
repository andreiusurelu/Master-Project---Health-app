import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { constants } from '../constants/constants'

export const useFormData = defineStore('user-form', () => {
    const age = ref(null)
    const sex = ref(null)
    const weight = ref(null)
    const height = ref(null)
    const level = ref(null)

    const validateAge = computed(() => age.value !== null && age.value >= constants.minAge && age.value <= constants.maxAge)
    const validateWeight = computed(() => weight.value !== null && weight.value >= constants.minWeight && weight.value <= constants.maxWeight)
    const validateHeight = computed(() => height.value !== null && height.value >= constants.minHeight && height.value <= constants.maxHeight)
    const validForm = computed(() => validateAge && validateHeight && validateWeight && sex !== null && level !== null)

    function $reset() {
        age.value = null
        sex.value = null
        weight.value = null
        height.value = null
        level.value = null
    }

    return {age, sex, weight, height, level, validateAge, validateWeight, validateHeight, validForm, $reset}
})