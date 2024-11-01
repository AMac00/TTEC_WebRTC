<script setup>
import { onMounted } from 'vue'
import { finesseStore } from '@/stores/finesseStore'
import { wazoStore } from '@/stores/wazoStore'
import Microphone from '@/app/Microphone'
import MicrophoneIcon from '@/components/MicrophoneIcon.vue'
import MusicalIcon from '@/components/MusicalIcon.vue'
import NoIcon from '@/components/NoIcon.vue'
import PhoneIcon from '@/components/PhoneIcon.vue'
import PhoneXMarkIcon from '@/components/PhoneXMarkIcon.vue'
import Speaker from '@/app/Speaker'
import SpeakerIcon from '@/components/SpeakerIcon.vue'
import SpeakerXMarkIcon from '@/components/SpeakerXMarkIcon.vue'
import User from '@/app/finesse/User'
import YesIcon from '@/components/YesIcon.vue'


new User()

const microphone = new Microphone()

const speaker = new Speaker()

function toggleMute() {
    finesseStore.log('In App.toggleMute()')
    
    console.log("WebRTC", Wazo)
    if (wazoStore.callSession.muted) {
        return Wazo.Phone.unmute(wazoStore.callSession)
    }
    
    return Wazo.Phone.mute(wazoStore.callSession)             
}

onMounted(() => {
    window.addEventListener("beforeunload", () => {
        finesseStore.log('In Window.beforeunload()')
        
        if (! wazoStore.phone.status) {
            return
        }
        
        if (wazoStore.callSession) {
            Wazo.Phone.hangup(wazoStore.callSession)
        }
        
        Wazo.Phone.disconnect()
    })
})

</script>

<template>
    <div v-if="finesseStore.user.isWebRTC" class="container">
        <div class="mx-2 font-bold">
            WebRTC
        </div>
        <div class="mx-2">
            <div 
                class="text-white py-1 px-2 rounded border border-gray-light"
                :class="wazoStore.phone.status ? 'bg-green' : 'bg-red'"
            >
                <phone-icon v-if="wazoStore.phone.status" />
                <phone-x-mark-icon v-else />
            </div>
        </div>
        <div class="mx-2">
            <button 
                @click="microphone.verify()" 
                class="text-white py-1 px-2 rounded border border-gray-light inline-flex items-center"
                :class="wazoStore.microphone.status === 'success' ? 'bg-green' : wazoStore.microphone.status === 'error' ? 'bg-red' : 'bg-white text-black'"
                :disabled="wazoStore.microphone.status === 'initializing'"
            >
                <microphone-icon />{{ wazoStore.microphone.message }}
            </button>
        </div>
        <div class="mx-2">
            <template v-if="wazoStore.speaker.status === 'testing'">
                <div class="inline-flex items-center">Did you hear the audio?
                    <button 
                        @click="speaker.reportSuccess()"
                        class="py-1 px-2 mx-2 rounded border border-gray-light text-white bg-black hover:bg-blue"
                    >
                        <yes-icon />
                    </button>
                    <button 
                        @click="speaker.reportError()"
                        class="py-1 px-2 mx-2 rounded border border-gray-light text-white bg-black hover:bg-blue"
                    >
                        <no-icon />
                    </button>
                </div>
                
            </template>
            <template v-else>
                <button 
                    @click="speaker.verify()" 
                    class="text-white py-1 px-2 rounded border border-gray-light inline-flex items-center"
                    :class="wazoStore.speaker.status === 'success' ? 'bg-green' : wazoStore.speaker.status === 'error' ? 'bg-red' : 'bg-white text-black'"
                >
                    <musical-icon />Test Sound
                </button>
            </template>
            
        </div>
        <div v-if="wazoStore.callSession" class="call-session">
            <button 
                    @click="toggleMute" 
                    class="text-white py-1 px-2 rounded border border-gray-light inline-flex items-center"
                    :class="wazoStore.callSession.muted ? 'bg-red' : 'bg-white text-black'"
                >
                    <speaker-x-mark-icon v-if="wazoStore.callSession.muted === true"> </speaker-x-mark-icon>
                    <speaker-icon v-else></speaker-icon>
                    {{ wazoStore.callSession.muted ? 'Unmute' : 'Mute' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    
    .call-session {
        border-left: 1px solid #d7d7d8;
        margin-left: 8px;
        padding-left: 16px;
    }
</style>
