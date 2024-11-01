import { wazoStore } from '@/stores/wazoStore'

export default class Microphone {
    async verify() {
        if (navigator.mediaDevices) {
            const constraints = window.constraints = {
                audio: true, 
                video: true
            }
        }
        
        try {
            if (window.stream) {
                wazoStore.microphone.message = 'Test Mic'
                
                window.stream.getAudioTracks().forEach(track => {
                    if (track.enabled && ! track.muted) {
                        wazoStore.microphone.status = 'success'    
                    } else {
                        wazoStore.microphone.status = 'error'
                    }
                    track.stop()
                })
                
                window.stream = null
                
                if (! wazoStore.microphone.status) {
                    wazoStore.microphone.status = 'error'
                }
            } else {
                wazoStore.microphone.status = 'initializing'
            
                wazoStore.microphone.message = 'Starting...'
                
                window.stream = await navigator.mediaDevices.getUserMedia(constraints)
                
                wazoStore.microphone.status = null
                
                wazoStore.microphone.message = 'Stop Test'
                
                const audio = document.createElement('audio')
                
                audio.controls = true
                
                audio.autoplay = true
                
                audio.srcObject = window.stream
            }
        } catch (error) {
            wazoStore.microphone.status = 'error'
    
            wazoStore.microphone.message = error.message
            
            setTimeout(() => {
                wazoStore.microphone.message = 'Test Mic'
            }, 5000);
        }   
    }
}