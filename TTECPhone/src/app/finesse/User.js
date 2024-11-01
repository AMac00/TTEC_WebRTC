import { finesseStore } from '@/stores/finesseStore'
import SoftPhone from '@/app/SoftPhone'

export default class User {
    constructor() {
        finesseStore.log('In User.constructor()')
        
        new finesse.restservices.User({
            id: finesse.gadget.Config.id, 
            onLoad: this.onLoad()
        })
    }
    
    onLoad() {
        return data => {
            finesseStore.log('In User.onLoad()')
            
            finesseStore.user.class = data
            
            const userData = data.getData()

            finesseStore.user.loginName = userData.loginName
            
            if (userData.mobileAgent) {
                finesseStore.user.isWebRTC = true
                new SoftPhone().launchPhone()    
            }
        }
    }
}