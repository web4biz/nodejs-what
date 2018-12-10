var koa     = require('koa'),
    app     = koa();

app.use( function *(next){
    var start   = new Date;
  
    yield next;
    
    var ms = new Date - start;
    this.set('Response-Time', ms + 'ms');
});


app.use( function *(){
    this.body = 'Hello World';
});

app.listen(3000);