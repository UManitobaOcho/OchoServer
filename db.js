module.exports = {
    url: "",
    getProf: function(socket){
        socket.emit('foundProf', {username: 'Charlie'});
    },
    getStudent: function(socket){
        socket.emit('foundStudent', {username: 'Nico'});
    }
};

/* //Un-comment to use the database
module.exports ={
    url: "",
    getProf: function(socket){
        pg.connect(url, function(err, client, done) {
	    if (err) {
	        return console.error('error fetching client from pool', err);
	    }

	    client.query("SELECT * FROM PROFESSORS", function(err, result) {
	        done();  // release the client back to the pool

	        if (err) {
		    return console.error('error running query', err);
	        }

	        socket.emit('foundProf', result.rows[0]);
	    });
        });
    }
};

*/
