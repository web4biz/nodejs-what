var config      = require('./config.json'),

    express     = require('express'),
    app         = express(),

    server      = require('http').createServer( app ).listen( config.port ),
    io          = require('socket.io').listen( server ),

    numConn     = 0;

app.use( express.static( './client' ) );
app.use( express.static( '../static' ) );

// io.on( 'connection', function(socket) {

//     numConn     += 1;
//     console.log( "connected", numConn );

// });

io.on( 'connection', function(socket) {

    function login ( name ) {
        console.log( "login", name );
        socket.nickname     = name;
    }

    numConn     += 1;
    console.log( "connected", numConn );

    // tell the socket to identify (for relogin after restart of node session)
    socket.emit( "relogin", {}, login );

    // event for login from socket
    socket.on( "login", login );

    // socket sends message
    socket.on( "sendMessage", function( msg ) {
        console.log( "send message", numConn, socket.nickname, msg );

        // broadcast message to all subscribed sockets
        socket.broadcast.emit( "newMessage", {
            name:       socket.nickname,
            msg:        msg
        } );
    });

    socket.on( "disconnect", function() {
        numConn     -= 1;
        console.log( "disconnect", numConn );
    });
});