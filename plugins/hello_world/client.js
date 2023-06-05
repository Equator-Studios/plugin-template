// example client.js

return ({ shared }) => ({
    init: () => {
        console.log("sending ping");
        shared.socket.send("plugins/hello_world", "hello world from the client");
    },
})
