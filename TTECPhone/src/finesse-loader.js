finesse.modules = finesse.modules || {};
finesse.modules.callbacks = (function($) {
    return {
        /**
        * Performs all initialization for this gadget
        */
        init: function() {
            clientLogs = finesse.cslogger.ClientLogger
            
            utils = finesse.utilities.Utilities

            finesse.clientservices.ClientServices.init(finesse.gadget.Config)
            
            clientLogs.init(gadgets.Hub, `${import.meta.env.VITE_FINESSE_LOGGER_NAME}`)

            containerServices = finesse.containerservices.ContainerServices.init()
            
            containerServices.addHandler(finesse.containerservices.ContainerServices.Topics.ACTIVE_TAB, function() {
                clientLogs.log("Gadget is now visible")
                gadgets.window.adjustHeight()
            });
            
            containerServices.makeActiveTabReq();
            
            const script = document.createElement('script')

            script.setAttribute('src', `/3rdpartygadget/files/${import.meta.env.VITE_FINESSE_FOLDER_NAME}/assets/index.js`)

            script.setAttribute('type', 'module')

            document.getElementsByTagName('head')[0].appendChild(script)
        }
    }
})(jQuery)
    
gadgets.HubSettings.onConnect = function () {
    finesse.modules.callbacks.init()
}