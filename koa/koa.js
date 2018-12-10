const conf      = require('./config.json'),
      Koa       = require('koa'),
      app       = new Koa(),
      favicon   = require('koa-favicon'),
      rest      = require('./lib/restHandler.js')(),
      log       = require('debug')('app:main');

app.use( favicon( __dirname + '/public/favicon.ico') );

app.use( async ( ctx, next ) => {
    var start   = new Date;
    log( "a way down", ctx.req.url );
    
    await next();
    
    log( 'a way back' );
    log( 'a Response-Time', new Date - start );
});

app.use( ( ctx, next ) => {
    var start   = new Date;
    log( "b way down", ctx.req.url );
    
    return next().then( function() {
        log( 'b way back' );
        log( 'b Response-Time', new Date - start );
    });
});

app.use( auth );
app.use( rest );

app.listen( conf.port );
log( 'koa listening' );

// auth
function auth( ctx, next ) {

    // check for user
    if (!ctx.query.user) {
        log( "Not a valid user" );
        ctx.status  = 500;
        ctx.body    = "Not a valid user";
        return;
    }

    // valid user
    log( "Valid user" );
    return next();
}