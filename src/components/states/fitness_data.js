import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import exerciseData from '../constants/fitness_exercises.json' with {type: 'json'}

export const useFitnessStore = defineStore('fitness-data', () => {
    const selectedExercise = ref(null)
    const fitnessSessionData = ref(null)
    const exerciseList = ref(exerciseData.map(exercise => ({...exercise, selected: false})))

    const name = computed(() => selectedExercise.value == null ? null : selectedExercise.value.name)
    const noReps = computed(() => selectedExercise.value == null ? 0 : selectedExercise.value.noReps)

    const allSelected = computed(() => exerciseList.value.every((exercise) => exercise['selected']))

    function updateExerciseList(userExerciseData) {
        const modifiedData = userExerciseData.map(item => item['exerciseName']);
        exerciseList.value.forEach(exercise => {
            if (modifiedData.includes(exercise['name'])) {
                exercise['selected'] = true;
            }
        });
    }

    function setSelectedExercise(exercise) {
        selectedExercise.value = exercise
    }

    function setFitnessSessionData(data) {
        fitnessSessionData.value = data
    }

    function $reset() {
        selectedExercise.value = null;
        fitnessSessionData.value = null;
        exerciseList.value = exerciseData.map(exercise => ({...exercise, selected: false}));
    }

    return {selectedExercise, fitnessSessionData, exerciseList, name, noReps, allSelected, updateExerciseList, setSelectedExercise, setFitnessSessionData, $reset}
})