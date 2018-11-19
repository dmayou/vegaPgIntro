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
app.get('/songs', (req, res) => {
    console.log('/test GET hit');
    // create query
    const queryString = 'SELECT * FROM songs;';
    pool.query(queryString)
        .then((results) => {
            res.send(results.rows);
        })
        .catch( (err) => {
            console.log('error retrieving data:', err)
        });
});

app.post('/songs', (req, res) => {
    console.log('in /songs POST:', req.body);
    const queryString = `INSERT INTO songs (artist, track, rank, published)
        VALUES ($1, $2, $3, $4);`; // parameterized query
    pool.query(queryString,
        [ req.body.artist, req.body.track, req.body.rank, req.body.published])
        .then((response) => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log('error writing song:', err);
            res.sendStatus(500); // maybe this number is inspecific;
        });
});