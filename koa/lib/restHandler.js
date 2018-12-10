'use strict';

const conf      = require('../config.json'),
      Router    = require('koa-router'),
      mongo     = require('./mongo.js')( conf.db ),
      log       = require('debug')('app:restHandler');

module.exports  = function() {
    var router    = new Router({
            prefix:   "/rest"
        });

    // get data from database
    router.get( "/:table", async ( ctx, next ) => {
        log( 'get table', ctx.params );
        
        let data    = await mongo.find( {
                coll:   ctx.params.table
            } );
        ctx.body    = data;
    });
    
    // get specific record
    router.get( "/:table/:id", async ( ctx, next ) => {
        console.log( "get", ctx.params.table, ',id', ctx.params.id );
        let data    = await mongo.findOne( {
            coll:   ctx.params.table,
            where:  { _id: ctx.params.id }
        } );
        ctx.status  = 200;
        ctx.body    = data && data[0];
    });

    // create record
    router.post( "/:table/:id", async ( ctx, next ) => {
        let body        = ctx.request.body;
        
        body._id    = ctx.params.id;

        try {
            let data        = await mongo.create( {
                    coll:       ctx.params.table,
                    where:      { _id: ctx.params.id },
                    body:       body
                } );
            ctx.body    = data;
        }
        catch(err) {
            ctx.body    = err;
            ctx.status  = 500;
        }
    });

    return router.routes();
};
