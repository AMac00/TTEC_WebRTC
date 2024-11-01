import { finesseStore } from '@/stores/finesseStore'
import { wazoStore } from '@/stores/wazoStore'

export default class SoftPhone {
    constructor() {
        finesseStore.log('In SoftPhone.constructor()')
        
        this.session = null
        
        this.server = import.meta.env.VITE_RTC_FQDN
    }
    
    getSessionOnStorage() {
        finesseStore.log('In SoftPhone.getSessionOnStorage()')
        try {
            return JSON.parse(localStorage.getItem('session'))    
        } catch (e) {
            return null
        }
    }
    
    setSessionOnStorage() {
        finesseStore.log('In SoftPhone.setSessionOnStorage()')
        
        localStorage.setItem('session', JSON.stringify(this.session))
    }
    
    async launchPhone() {
        finesseStore.log('In SoftPhone.launchPhone()')
        
        const rawSession = this.getSessionOnStorage()
        
        if (! rawSession) {
            return this.newAuth()
        } else {
            try {
                Wazo.Auth.setHost(this.server)
                
                this.session = await Wazo.Auth.validateToken(rawSession.token, rawSession.refreshToken)
                
                if (this.session) {
                    this.login()
                } else {
                    this.newAuth()
                }
            } catch (e) {
                return
            }
        }
    }
    
    login() {
        finesseStore.log('In SoftPhone.login()')
        
        this.session = null
        
        this.initializeWebRtc()
    }
    
    async newAuth() {
        finesseStore.log('In SoftPhone.newAuth()')
        
        try {
            finesseStore.log('Setting host')
            Wazo.Auth.setHost(this.server)
            
            finesseStore.log('Logging in.')
            this.session = await Wazo.Auth.logIn(finesseStore.user.loginName, finesseStore.user.loginName).catch((err) => {
                finesseStore.log('Login failed!!')
            })
        } catch(e){
            return
        } finally {
            if (this.session) {
                finesseStore.log('Completed login successfully.')    
                
                this.setSessionOnStorage()
                
                this.login()
            }
        }
    }
    
    initializeWebRtc() {
        finesseStore.log('In SoftPhone.initializeWebRtc()')
        
        new (window.AudioContext || window.webkitAudioContext)

        Wazo.Phone.connect({
            media: {
              audio: true,
              video: true,
            }
        })
          
        wazoStore.phone.status = true
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_INCOMING, this.onCallIncoming)
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_ACCEPTED, this.onCallAccepted)
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_FAILED, this.onCallFailed)
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_ENDED, this.onCallEnded)
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_HELD, this.onSessionUpdate)
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_RESUMED, this.onSessionUpdate)
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_MUTED, this.onSessionUpdate)
        
        Wazo.Phone.on(Wazo.Phone.ON_CALL_UNMUTED, this.onSessionUpdate)
        
        Wazo.Phone.on(
            Wazo.Phone.ON_REINVITE, (session, request, updatedCalleeName) => {
                const callSession = sessions[session.id]
                
                if (callSession) {
                    currentSession.realDisplayName = updatedCalleeName;
                    
                    this.onSessionUpdate(currentSession);
                }
            }
        )    
    }
    
    onCallIncoming = (callSession, withVideo) => {
        finesseStore.log('In SoftPhone.onCallIncoming()')

        Wazo.Phone.accept(callSession, false)
    }
    
    onCallAccepted = (callSession, withVideo) => {
        finesseStore.log('In SoftPhone.onCallAccepted()')
        
        wazoStore.callSession = callSession
    }
    
    onCallFailed = (callSession) => {
        finesseStore.log('In SoftPhone.onCallFailed()')
            
        wazoStore.callSession = null
    }
    
    onCallEnded = (callSession) => {
        finesseStore.log('In SoftPhone.onCallEnded()')
        
        wazoStore.callSession = null
    }
    
    onSessionUpdate = (callSession) => {
        finesseStore.log('In SoftPhone.onSessionUpdate()')
        
        wazoStore.callSession = callSession
    }
    
    hold() {
        finesseStore.log('In SoftPhone.hold()')
        
        Wazo.Phone.hold(wazoStore.callSession)
    }
    
    resume() {
        finesseStore.log('In SoftPhone.resume()')
        
        Wazo.Phone.resume(wazoStore.callSession)
    }
    
    hangup() {
        finesseStore.log('In SoftPhone.hangup()')
        
        Wazo.Phone.hangup(wazoStore.callSession)
    }
}
