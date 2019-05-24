var socket = io();


socket.on('disconnect', () => {

});

socket.on('connect', () => {
    console.log("connected");
});

socket.on('payment_request', function (data) {
    console.log(data);
});


var sendMessage = function () {
    const compSelector = '.write_msg';
    var valor = $(compSelector).val();
    socket.emit('mess_from_web', {message: valor});
    $(compSelector).val('');
};


$(function () {
    $(".msg_send_btn").click(function () {
        sendMessage();
    });
});

