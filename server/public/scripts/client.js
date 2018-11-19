$( document ).ready( readyNow );

function readyNow(){
    console.log( 'JQ' );
    $('#addSongButton').on('click', addSong);
} // end readynow

function addSong() {
    console.log('in addSong()');
    // get user input
    // package in an object
    const obj = {
        artist: $('#artistIn').val(),
        published: $('#publishedIn').val(),
        rank: $('#rankIn').val(),
        track: $('#trackIn').val()
    }
    console.log(obj);
    // send to server via AJAX
    $.ajax({
        method: 'POST',
        url: '/songs',
        data: obj
    }
    ).then( function(response) {
        console.log('back from POST with:', response);
        getSongs();
    }).catch( function(err) {
        console.log('error with POST', err);
    })
}

function getSongs() {
    $.ajax({
        method: 'GET',
        url: '/songs',
    }).then(function(response) {
        console.log(' back from GET with:' , response);
    }).catch(function(err) {
        console.log('error on GET:, err');
    });
}