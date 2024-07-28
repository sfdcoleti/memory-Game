({
    handlemessage: function(component, event) {
        var msg = event.getParam('msg')
        component.set("v.message", msg)
        console.log("message received: " + msg)
    }
})
