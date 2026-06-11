import { reactive } from 'vue'

export const globalStates = reactive ({
    modelLoaded: false,
    setModelLoaded(modelState) {
        this.modelLoaded = modelState
    },
    exerciseList: [],
    addExercise(id) {
        this.exerciseList.push(id)
    },
    clearList() {
        this.exerciseList.clearList()
    },
    hasExercise(id) {
        return this.exerciseList.includes(id)
    },
    isExerciseListFull() {
        return this.exerciseList.length == 3
    },
    exerciseListLoaded: false,
    detectionState: {NO_HISTORY: 1, MOVE: 2, VISIBLE: 3},
    selectedExercise: null,
    setSelectedExercise(exercise) {
        this.selectedExercise = this.selectedExercise
    }
})
