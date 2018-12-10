/* global io $ */

let socket      = null;

$(window).load( function() {

    // check status
    socket	= io.connect();

    socket.on( "newMessage", function( data ) {
        console.log( "got", data );
        message( data.name, data.msg );
    });

    $("#connect").click( function() {
        console.log( "connect", $("#nickname").val() );
        socket.emit( "login", $("#nickname").val() );

        $("div.noshow").css( { display: "flex" } );
    });

    $("#send").click( function() {
        var msg     = $("#message").val(),
            name    = $("#nickname").val();
            
        console.log( "send", name, msg );
        message( name, msg );
    
        socket.emit( "sendMessage", msg );
        $("#message").val( "" );

    });
});

function message( name, msg ) {
    $("#main").prepend( "<div class='row'><div class='col-4 col-sm-3 col-md-1'><b>" + name + "</b></div><div class='col-8 col-sm-9 col-md-11'>" + msg + "</div></div>" );
}