// REQUIRED STUFF --------------------------------------------------------------------
const bodyParser = require('body-parser');
const express = require('express')
const path = require('path');
const multer = require('multer');
const mysql = require('mysql');
const useragent = require('express-useragent');

const app = express();
const port = process.env.PORT || 9000;

// Set Favicon
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'src/img/', 'icon.ico')));

var upload = multer({
	limits: { fieldSize: 20 * 1024 * 1024 }
})

// Parse json data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// For multi form data
app.use(upload.array());

//Secure SHA256
let crypto;
try {
	crypto = require('crypto');
} catch (err) {
	console.log('crypto support is disabled!');
}

app.use(useragent.express()); // mobile detection

// [ LOGIN ] Admin -----------------------------------------------------------------
var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'secret_perchamagasin',
	resave: false,
	saveUninitialized: false
}))

app.get('/check_login/:pass', function(req, res) {

	const {pass } = req.params; //sin hash

	var hashed_input = crypto.createHmac('sha256', pass)
		.digest('hex');

	if(hashed_input=="1774d5603c8a7b15589f5330fb21e2bd3b289784f55c2607a8f0b0f457f67bfc")
	{
		req.session.flag = 1;
		res.send("1"); // OUI correcto paswordo
	}
	else
	{
		req.session.flag = 0;
		res.send("0"); // Not so correctou
	}
});





// [ MYSQL ]  ----------------------------------------------------------------------------

// Heroku DB
// mysql://b375ab530b6efd:cf4ade3a@us-cdbr-east-03.cleardb.com/heroku_a16f974a985f837?reconnect=true

var db_config = {
	host:"us-cdbr-east-03.cleardb.com",
	user:"b375ab530b6efd",
	password: "cf4ade3a",
	database:"heroku_a16f974a985f837"
};

var connection;

function handleDisconnect() {
	connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

	connection.connect(function(err) {              // The server is either down
		if(err) {                                     // or restarting (takes a while sometimes).
			console.log('[ERR] error when connecting to db:', err);
			setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
		}
		else {
			console.log("[OK] Database server running...");
		}                                     // to avoid a hot loop, and to allow our node script to
	});                                     // process asynchronous requests in the meantime.
											// If you're also serving http, display a 503 error.
	connection.on('error', function(err) {
		console.log('[ERR] DB disconected...');
		if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
			handleDisconnect();                         // lost due to either server restart, or a
		} else {                                      // connnection idle timeout (the wait_timeout
			throw err;                                  // server variable configures this)
		}
	});
}

handleDisconnect();

// ENDPOINTS ----------------------------------------------------------------------------

// [ GET ] ALL ----------------------------------------------
// All posts
app.get('/get_allposts', function(req, res) {

	const sql = 'SELECT * FROM posts WHERE status>0';

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// All feat
app.get('/get_allfeat', function(req, res) {

	const sql = 'SELECT * FROM feat WHERE status>0';

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// All cols
app.get('/get_allcols', function(req, res) {

	const sql = 'SELECT * FROM cols WHERE status>0';

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {

			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// All news
app.get('/get_allnews', function(req, res) {

	const sql = 'SELECT * FROM news WHERE status>0';

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {

			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// All interviews
app.get('/get_allinterviews', function(req, res) {

	const sql = 'SELECT * FROM interviews WHERE status>0';

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {

			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// Destacados posts
app.get('/get_destacados', function(req, res) {

	const sql = 'SELECT * FROM posts WHERE status=2';

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});

// [ GET ] BY ID ----------------------------------------------
// get post by ID
app.get('/get_post/:id', function(req, res) {

	const {id } = req.params
	const sql = `SELECT * FROM posts WHERE id=${id} AND status>0`;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// get feat by ID
app.get('/get_feat/:id', function(req, res) {

	const {id } = req.params
	const sql = `SELECT * FROM feat WHERE id=${id} AND status>0`;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// get interview by ID
app.get('/get_interview/:id', function(req, res) {

	const {id } = req.params
	const sql = `SELECT * FROM interviews WHERE id=${id} AND status>0`;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});

// col by id
app.get('/get_col/:id', function(req, res) {

	const {id } = req.params
	const sql = `SELECT * FROM cols WHERE id=${id} AND status>0`;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});

// news by id
app.get('/get_news/:id', function(req, res) {

	const {id } = req.params
	const sql = `SELECT * FROM news WHERE id=${id} AND status>0`;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});


// [ GET ] IMAGES ----------------------------------------------
// img posts
app.get('/get_im_url/:id', function(req, res) {
	const id = req.params["id"];
	const sql = 'SELECT * FROM posts_images WHERE post_id='+id;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// img posts
app.get('/get_im_feat/:id', function(req, res) {
	const id = req.params["id"];
	const sql = 'SELECT * FROM feat_images WHERE post_id='+id;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// img interviews
app.get('/get_im_interview/:id', function(req, res) {
	const id = req.params["id"];
	const sql = 'SELECT * FROM interviews_images WHERE post_id='+id;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// img cols
app.get('/get_im_col/:id', function(req, res) {
	const id = req.params["id"];
	const sql = 'SELECT * FROM cols_images WHERE post_id='+id;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});
// img news
app.get('/get_im_news/:id', function(req, res) {
	const id = req.params["id"];
	const sql = 'SELECT * FROM news_images WHERE post_id='+id;

	connection.query(sql,(err,result)=>{
		if(err){
			//throw err;
			res.send('{"error":"no_result"}');
		}
		if(result.length > 0) {
			res.json(result);
		}
		else {
			res.send('{"error":"no_result"}');
		}
	});
});


// [ ADD ] Stuff ----------------------------------------------
// Add post
app.post('/add_post', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) //ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO posts SET ?';

	const postObject = {
		title: req.body.title,
		descr: req.body.descr,
		date: req.body.date,
		main_text: req.body.main_text,
		secondary_text: req.body.secondary_text,
		status: req.body.status
	}

	connection.query(sql, postObject, (err, result)=> {
		if(err) {
			throw err;
		}
		else {
			res.send("Added post");

			console.log("LAST INSERTED ID: " + result.insertId);

			const sql2 = 'INSERT INTO posts_images SET ?';
			let base64Data = req.body.im;

			for (var i = 0; i < req.body.n; i++) { // For each image

				let postObject2 = {
					url: result.insertId+i.toString(),
					post_id: result.insertId
				}

				connection.query(sql2, postObject2, (err, result)=> { // Write to database
					if(err) {
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/stories/" + result.insertId + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
					console.log(err);
				});

				console.log("Added image: " + result.insertId+ i + ".png")
			}
		}
	});

})
// Add feat
app.post('/add_feat', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) //ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO feat SET ?';

	const postObject = {
		title: req.body.title,
		descr: req.body.descr,
		date: req.body.date,
		main_text: req.body.main_text,
		secondary_text: req.body.secondary_text,
		status: req.body.status
	}

	connection.query(sql, postObject, (err, result)=> {
		if(err) {
			throw err;
		}
		else {
			res.send("Added feat");

			console.log("LAST INSERTED ID: " + result.insertId);

			const sql2 = 'INSERT INTO feat_images SET ?';
			let base64Data = req.body.im;

			for (var i = 0; i < req.body.n; i++) { // For each image

				let postObject2 = {
					url: result.insertId+i.toString(),
					post_id: result.insertId
				}

				connection.query(sql2, postObject2, (err, result)=> { // Write to database
					if(err) {
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/feat/" + result.insertId + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
					console.log(err);
				});

				console.log("Added image: " + result.insertId+ i + ".png")
			}
		}
	});

})
// Add col
app.post('/add_col', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) //ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO cols SET ?';

	const postObject = {
		title: req.body.title,
		date: req.body.date,
		main_text: req.body.main_text,
		columnista: req.body.columnista,
		insta: req.body.insta,
		ocupacion: req.body.ocupacion,
		loc: req.body.loc,
		status: 1
	}

	connection.query(sql, postObject, (err, result)=> {
		if(err) {
			throw err;
		}
		else {
			res.send("Added col");

			console.log("LAST INSERTED ID: " + result.insertId);

			const sql2 = 'INSERT INTO cols_images SET ?';
			let base64Data = req.body.im;

			for (var i = 0; i < req.body.n; i++) { // For each image

				let postObject2 = {
					url: result.insertId+i.toString(),
					post_id: result.insertId
				}

				connection.query(sql2, postObject2, (err, result)=> { // Write to database
					if(err) {
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/cols/" + result.insertId + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
					console.log(err);
				});

				console.log("Added image: " + result.insertId + i + ".png")
			}
		}
	});
})

// Add noticia
app.post('/add_noticia', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) // ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO news SET ?';

	const postObject = {
		title: req.body.title,
		subtitle: req.body.subtitle,
		date: req.body.date,
		main_text: req.body.main_text,
		status: 1
	}

	connection.query(sql, postObject, (err, result)=> {
		if(err) {
			throw err;
		}
		else {
			res.send("Added news");

			console.log("LAST INSERTED ID: " + result.insertId);

			const sql2 = 'INSERT INTO news_images SET ?';
			let base64Data = req.body.im;

			// For each image
			for (var i = 0; i < req.body.n; i++) {

				let postObject2 = {
					url: result.insertId+i.toString(),
					post_id: result.insertId
				}

				// Write to database
				connection.query(sql2, postObject2, (err, result)=> {
					if(err) {
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/news/" + result.insertId + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
					console.log(err);
				});

				console.log("Added image: " + result.insertId+ i + ".png")
			}
		}
	});
})

// Add interview
app.post('/add_interview', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) // ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO interviews SET ?';

	const postObject = {
		title: req.body.title,
		descr: req.body.descr,
		author: req.body.author,
		date: req.body.date,
		location: req.body.location,
		main_text: req.body.main_text,
		secondary_text: req.body.secondary_text,
		spotify: req.body.spotify,
		creditos: req.body.creditos,
		status: 1
	}

	connection.query(sql, postObject, (err, result)=> {
		if(err) {
			throw err;
		}
		else {
			res.send("Added interview");

			console.log("LAST INSERTED ID: " + result.insertId);

			const sql2 = 'INSERT INTO interviews_images SET ?';
			let base64Data = req.body.im;

			// For each image
			for (var i = 0; i < req.body.n; i++) {

				let postObject2 = {
					url: result.insertId+i.toString(),
					post_id: result.insertId
				}

				// Write to database
				connection.query(sql2, postObject2, (err, result)=> {
					if(err) {
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/interviews/" + result.insertId + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
					console.log(err);
				});

				console.log("Added image: " + result.insertId + i + ".png")
			}
		}
	});
})

// [ EDIT ] Stuff ----------------------------------------------
// Edit post
app.put('/edit_post/:id', function (req, res) {
	const id = req.params["id"];
	const title = req.body.title;
	const descr = req.body.descr;
	const date = req.body.date;
	const main_text = req.body.main_text;
	const secondary_text = req.body.secondary_text;
	const status = req.body.status;

	const sql = 'UPDATE posts SET status='+'"'+status+'"'+', title='+'"'+title+'"'+', descr='+'"'+descr+'"'+', date='+'"'+date+'"'+', main_text='+'"'+main_text+'"'+', secondary_text='+'"'+secondary_text+'"'+' WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Post updated");
		}
	});
})// Edit feat
app.put('/edit_feat/:id', function (req, res) {
	const id = req.params["id"];
	const title = req.body.title;
	const descr = req.body.descr;
	const date = req.body.date;
	const main_text = req.body.main_text;
	const secondary_text = req.body.secondary_text;
	const status = req.body.status;

	const sql = 'UPDATE feat SET status='+'"'+status+'"'+', title='+'"'+title+'"'+', descr='+'"'+descr+'"'+', date='+'"'+date+'"'+', main_text='+'"'+main_text+'"'+', secondary_text='+'"'+secondary_text+'"'+' WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Feat updated");
		}
	});
})
// Edit interview
app.put('/edit_interview/:id', function (req, res) {
	const id = req.params["id"];

	const title = req.body.title;
	const descr = req.body.descr;
	const date = req.body.date;
	const main_text = req.body.main_text;
	const secondary_text = req.body.secondary_text;
	const author = req.body.author;
	const location = req.body.location;
	const spotify = req.body.spotify;

	const status = 1;

	const sql = 'UPDATE interviews SET status='+'"'+status+'"'+', spotify='+"'"+spotify+"'"+', secondary_text='+"'"+secondary_text+"'"+', title='+'"'+title+'"'+', descr='+'"'+descr+'"'+', date='+'"'+date+'"'+', main_text='+"'"+main_text+"'"+',location='+'"'+location+'"'+', author='+'"'+author+'"'+' WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Interview updated");
		}
	});
})
// Edit col
app.put('/edit_col/:id', function (req, res) {
	const id = req.params["id"];
	const title = req.body.title;
	const columnista = req.body.columnista;
	const insta = req.body.insta;
	const loc = req.body.loc;
	const ocupacion = req.body.ocupacion;

	const date = req.body.date;
	const main_text = req.body.main_text;

	const sql = 'UPDATE cols SET title='+'"'+title+'"'+', ocupacion='+'"'+ocupacion+'"'+', columnista='+'"'+columnista+'"'+', insta='+'"'+insta+'"'+', loc='+'"'+loc+'"'+', date='+'"'+date+'"'+', main_text='+'"'+main_text+'"'+' WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Cols updated");
		}
	});
})
// Edit news
app.put('/edit_news/:id', function (req, res) {
	const id = req.params["id"];
	const title = req.body.title;
	const subtitle = req.body.subtitle;

	const date = req.body.date;
	const main_text = req.body.main_text;

	const sql = 'UPDATE news SET title='+'"'+title+'"'+', subtitle='+'"'+subtitle+'"'+', date='+'"'+date+'"'+', main_text='+'"'+main_text+'"'+' WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("News updated");
		}
	});
})


// [ DELETE ] Stuff ----------------------------------------------
// Delete post
app.put('/delete_post/:id', function (req, res) {
	const id = req.params["id"];
	const sql = 'UPDATE posts SET status=0 WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Post status set to 0");
		}
	});
})
// Delete feat
app.put('/delete_feat/:id', function (req, res) {
	const id = req.params["id"];
	const sql = 'UPDATE feat SET status=0 WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Feat status set to 0");
		}
	});
})
// Delete interview
app.put('/delete_interview/:id', function (req, res) {
	const id = req.params["id"];
	const sql = 'UPDATE interviews SET status=0 WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("interview status set to 0");
		}
	});
})
// Delete col
app.put('/delete_col/:id', function (req, res) {
	const id = req.params["id"];
	const sql = 'UPDATE cols SET status=0 WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Col status set to 0");
		}
	});
})
// Delete news
app.put('/delete_news/:id', function (req, res) {
	const id = req.params["id"];
	const sql = 'UPDATE news SET status=0 WHERE id='+id;

	connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("News status set to 0");
		}
	});
})


// [ ADMIN ROUNTING ] --------------------------------------------------------------------

// login
app.get('/admin', function(req, res) {
	res.sendFile(path.join(__dirname + '/admin/login.html'));
});
app.get('/admin_css', function(req, res) {
	res.sendFile(path.join(__dirname + '/admin/css/login_admin.css'));
});

// js files
app.get('/login_js', function(req, res) {
	res.sendFile(path.join(__dirname + '/admin/js/login.js'));
});
app.get('/functions_js', function(req, res) {
	res.sendFile(path.join(__dirname + '/admin/js/functions.js'));
});

//admin menu
app.get('/admin_all', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/all.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});

// Admin Adder
app.get('/admin_new_what', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new_what.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new_feat', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new_feat.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new_col', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new_columna.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new_noticia', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new_noticia.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new_interview', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new_interview.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});

// Admin Edit
app.get('/admin_edit/:id', function(req, res) {
	const id = req.params["id"];

	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/edit.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_edit_feat/:id', function(req, res) {
	const id = req.params["id"];

	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/edit_feat.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_edit_col/:id', function(req, res) {
	const id = req.params["id"];

	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/edit_col.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_edit_news/:id', function(req, res) {
	const id = req.params["id"];

	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/edit_news.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_edit_interview/:id', function(req, res) {
	const id = req.params["id"];

	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/edit_interview.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});

// Admin Delete
app.get('/admin_delete', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/delete.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});

// Send JS Admin
app.get('/uploadfile_js', function(req, res) {
	res.sendFile(path.join(__dirname + '/admin/js/uploadfile.js'));
});
app.get('/uploadfile_js2', function(req, res) {
	res.sendFile(path.join(__dirname + '/admin/js/uploadfile2.js'));
});
app.get('/edit_js', function(req, res) {
	res.sendFile(path.join(__dirname + '/admin/js/edit.js'));
});
app.get('/admin_js/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/admin/js/'+filename));
});


// [ PUBLIC Routing ] ----------------------------------------------------------------------

// Send live 
app.get('/diorlive', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/tory.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/tory.html'));} //desktop
});

// Send stories img
app.get('/stories_img/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/uploads/stories/'+filename));
});
// Send feat img
app.get('/feat_img/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/uploads/feat/'+filename));
});
// Send Interviews img
app.get('/interviews_img/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/uploads/interviews/'+filename));
});
// Send news img
app.get('/news_img/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/uploads/news/'+filename));
});
// Send articles img
app.get('/cols_img/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/uploads/cols/'+filename));
});
// Send IMG
app.get('/img/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/img/'+filename));
});
// Send videos
app.get('/videos/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/videos/'+filename));
});
// Send CSS
app.get('/css/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/css/'+filename));
});
// Send JS
app.get('/js/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/js/'+filename));
});

// Send home
app.get('/', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/home.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/home.html'));} //desktop
});
app.get('/home', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/home.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/home.html'));} //desktop
});

// Send feat
app.get('/stories', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/stories.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/home.html'));} //desktop
});

// Send feat
app.get('/feat', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/feat.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/feat.html'));} //desktop
});

// Send news
app.get('/news', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/news.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/news.html'));} //desktop
});

// Send news-posts
app.get('/news_post/:id', function(req, res) {
	const id = req.params["id"];
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/news_post.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/news_post.html'));}//desktop
});

// Send interviews
app.get('/interviews', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/interviews.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/interviews.html'));}//desktop
});

// Send interviews-posts
app.get('/interview_post/:id', function(req, res) {
	var mobile = req.useragent.isMobile;
	const id = req.params["id"];
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/interview_post.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/interviews_post.html'));}//desktop
});

// Send articles
app.get('/articles', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/articles.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/articles.html'));}//desktop
});

// Send articles-posts
app.get('/articles_post/:id', function(req, res) {
	var mobile = req.useragent.isMobile;
	const id = req.params["id"];
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/articles_post.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/articles_post.html'));}//desktop
});

// Send Story
app.get('/stories_post/:id', function(req, res) {
	var mobile = req.useragent.isMobile;
	const id = req.params["id"];
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/stories_post.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/stories_post.html'));}//desktop
});
// Send Feat
app.get('/feat_post/:id', function(req, res) {
	var mobile = req.useragent.isMobile;
	const id = req.params["id"];
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/feat_post.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/feat_post.html'));}//desktop
});
// Send contact
app.get('/contact', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/contact.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/contact.html'));}//desktop
});

// Send about
app.get('/about', function(req, res) {
	var mobile = req.useragent.isMobile;
	if(mobile){res.sendFile(path.join(__dirname + '/src/mobile/about.html'));} //mobile
	if(!mobile){res.sendFile(path.join(__dirname + '/src/about.html'));}//desktop
});

// Send temp
app.get('/temp', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/template.html'));
});

// 404
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/notfound.html'));
});

// [ SERVER PORT ] --------------------------------------------------------------------------
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})
