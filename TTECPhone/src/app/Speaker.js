import { wazoStore } from '@/stores/wazoStore'

export default class Speaker {
    verify() {
        wazoStore.speaker.status = 'testing'
        
        const audio = document.createElement('audio')
        
        audio.controls = true
        
        audio.autoplay = true
        
        audio.src = `/3rdpartygadget/files/${import.meta.env.VITE_FINESSE_FOLDER_NAME}/audio-test.wav`
    }
    
    reportSuccess() {
        wazoStore.speaker.status = 'success'
    }
    
    reportError() {
        wazoStore.speaker.status = 'error'
    }
}