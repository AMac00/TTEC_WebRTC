import { reactive } from 'vue'

export const wazoStore = reactive({
    phone: {
        status: null,
    },
    microphone: {
        status: null,
        message: 'Test Mic'
    },
    speaker: {
        status: null
    },
    callSession: null
})