let Datastore = require('nedb');
let db = {
	cameras: new Datastore({ filename: __dirname + '/store/cameras.db', autoload: true, timestampData: true}),
	chats: new Datastore({filename: __dirname + '/store/chats.db', autoload: true, timestampData: true})
};

module.exports = db;