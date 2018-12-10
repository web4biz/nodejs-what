'use strict';

const conf      = require('../config.json'),
      mongoCli  = require('mongodb'),
      log       = require('debug')('app:mongo');

let db;

module.exports	= function() {
    var data    = new Data();
    return data;
};

function Data() {
    return this;
}

Data.prototype.find     = async ( elm ) => {
    log( 'find', elm );
    let db      = await connect();
    let data    = await find( db, elm );
    return data;
};

Data.prototype.findOne     = async ( elm ) => {
    log( 'findOne', elm );
    let db      = await connect();
    let data    = await findOne( db, elm );
    return data;
};

Data.prototype.create     = async( elm ) => {
    log( 'create', elm );
    
    try {
        let db      = await connect();
        let data    = await insert( db, elm );

        return data;
    }
    catch(err) {
        throw new Error(err);
    }
};

// connect to mongo
function connect () {
    return new Promise( ( resolve, reject ) => {
        let mongoUrl    = `mongodb://${conf.db.host}:${conf.db.port}/${conf.db.name}`;

        if (db)
            return resolve( db );

        mongoCli.connect( mongoUrl, ( err, db ) => {
            if (err)
                reject( err );
            else
                resolve( db );
        } );
    });
}

// find data
async function find( db, elm ) {
    try {
        // get collection
        let coll    = db.collection( elm.coll );
    
        // find
        let data    = await coll.find( elm.where ).toArray();
        
        return data;
    }
    catch(err) {
        throw err;
    }
}

// finOned data
async function findOne( db, elm ) {

    try {
        // get collection
        let coll    = db.collection( elm.coll );
    
        // find
        let record  = await coll.findOne( elm.where );
        
        return record;
    }
    catch(err) {
        throw err;
    }
}
// create data
function insert( db, elm ) {
    return new Promise( ( resolve, reject ) => {
        
        // get collection
        let coll    = db.collection( elm.coll );
        
        // find 
        coll
            .insert( elm.body, ( err, data ) => {
                if (err)
                    reject( err );
                else
                    resolve( data );
            });
    });
}