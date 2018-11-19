// requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
const pg = require('pg');
//uses
app.use( express.static( 'server/public/' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
//globals
const port = process.env.PORT || 5000;
const Pool = pg.Pool; // capitalized because it's a class
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432,
    max: 10, // maximum number of connections
    idleTimeoutMillis: 30000
});
pool.on('connect', () => {
    console.log('connected to database')
});
pool.on('error', (err) => {
    console.log('error with DB:', err);
})

// spin up server
app.listen( port, ( req, res )=>{
    console.log( 'server up on:', port );
});

// test route
app.get('/test', (req, res) => {
    console.log('/test GET hit');
    // create query
    const queryString = 'SELECT * FROM songs;';
    pool
        .query(queryString)
        .then((results) => {
            res.send(results.rows);
        })
        .catch( (err) => {
            console.log('error retrieving data:', err)
        });
});