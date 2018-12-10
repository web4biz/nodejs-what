const config      = require('./config.json'),

      express     = require('express'),
      app         = express(),

      server      = require('http').createServer( app ).listen( config.port ),
      io          = require('socket.io').listen( server ),
      
      log         = require('debug')('app:main');

let numConn     = 0;

app.use( express.static( './client' ) );
app.use( express.static( '../static' ) );

// event for connection of socket
io.on( 'connection', function(socket) {

    function login ( name ) {
        log( "login", name );
        socket.nickname     = name;
    }

    numConn     += 1;
    log( "connected", numConn, socket.nickname );

    // event for login from socket
    socket.on( "login", login );

    // socket sends message
    socket.on( "sendMessage", function( msg ) {
        log( "send message", numConn, socket.nickname, msg );

        // broadcast message to all subscribed sockets
        socket.broadcast.emit( "newMessage", {
            name:       socket.nickname,
            msg:        msg
        } );
    });

    // Trigger for disconnect
    socket.on( "disconnect", function() {
        numConn     -= 1;
        log( "disconnect", numConn );
    });
});