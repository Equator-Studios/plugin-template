// example server.js

return () => ({
    packetHandler: msg => {
        console.log('recieved message from plugin: ' + msg);
    }
})
