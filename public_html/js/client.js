var socket = io();


socket.on('disconnect', () => {

});
socket.on('connect', () => {
console.log("connected");
});

socket.on('message', function (data) {
    console.log(data);
});
