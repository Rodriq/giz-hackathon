const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let db = require('./store');

app.use(express.static('public'));


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// var adm;
function getAdmin(name, fn) {
	db.cameras.findOne({name: name}, (err, admin) => {
		fn(admin);
	});
};

db.cameras.remove({}, {multi: true}, (err, remv) => {
	console.log('DATABASE CLEARED');
});

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('cameraRequest', function(camName) {
		socket.userName = camName;
		let camera = { 
			id: socket.id,
			name: camName
		};
		// cameras.push(socket.id);
		db.cameras.insert(camera, (err, camera) => {
			if (err) {
				throw err;
			}
			if (camera) {
				console.log(camera);
				var props = {
					camName,
					id: socket.id, 
				};
				console.log('==-----------------------------------==')
				console.log(props)
				console.log('==-----------------------------------==')
				getAdmin('Admin', (res) => {
					// console.log(props);
					props.admin = res.id;
					// props.pilot = res.id;
					console.log(props.admin);
					console.log(props);

				});
				console.log('********');
				console.log(props);
				setTimeout(function() { io.emit('newCamera', props); console.log('After emit: ',props); }, 3000);

				console.log('After emit: ',props);
			}
			// getAdmin('Admin', (res) => {
			// 	console.log(res);
			// })
			
		})

	});
	
	socket.on('sendVideo', function(vid) {
		console.log(vid);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
		db.cameras.remove({id: socket.id}, {}, (err, removed) => {
			return removed;
		})
	});
});

http.listen(port, () => console.log(`Listening on port *:${port}`));