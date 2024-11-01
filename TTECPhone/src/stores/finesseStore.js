import { reactive } from 'vue'

export const finesseStore = reactive({
    log: finesse.cslogger.ClientLogger.log,
    user: {
        class: null,
        loginName: null,
        isWebRTC: null,
    }
})