const conf      = require('./config.json'),
      Koa       = require('koa'),
      app       = new Koa(),
      Router    = require('koa-router'),
      router    = new Router({
          prefix:   "/rest"
      }),
      co        = require('co');

router.get( '/', function( ctx, next ) {
    ctx.body = 'Hello World';
    console.log( 'router' );
});

router.get( "/:table", function( ctx ) {
    ctx.body    = "Request: " + ctx.params.table;
});
router.get( "/:table/:id", function( ctx ) {
    ctx.body    = ctx.params;
});

app.use( co.wrap( function *( ctx, next){
    const start   = new Date;
  
    yield next();
    
    var ms = new Date - start;
    console.log( 'Response-Time', ms );
}));

app.use( router.routes() );

app.use( ctx => {
    ctx.body = 'Hello World';
    console.log( 'req' );
});

app.listen( conf.port );
console.log( 'koa listening' );