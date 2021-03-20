// REQUIRED STUFF --------------------------------------------------------------------
const Bundler = require('parcel-bundler');
const bodyParser = require('body-parser');
const express = require('express')
const path = require('path');
const multer = require( 'multer');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 9000;


var upload = multer();

// Parse json data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// For multi form data
app.use(upload.array());

// MYSQL  ----------------------------------------------------------------------------

let connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password: "",
	database:"perchaterciopelo"
}); 

// check connection
connection.connect(error =>{
	if(error){
		throw error;
	}
	else {
		console.log("Database server running...");
	}
});

// ENDPOINTS --------------------------------------------------------------------

// get all posts
app.get('/get_allposts', function(req, res) {

    const sql = 'SELECT * FROM posts WHERE status=1';

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send("no hubo resultado");
    	}
    });
 
});

// get post by ID
app.get('/get_post/:id', function(req, res) {
    
    const {id } = req.params
    const sql = `SELECT * FROM posts WHERE id=${id} AND status=1`;

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send("no hubo resultado");
    	}
    });
});

// add post
app.post('/add_post', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) //ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO posts SET ?';

	const postObject = {
		title: req.body.title,
		descr: req.body.descr,
		status: 1
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
					url: req.body.title+i,
					post_id: result.insertId
				}

				connection.query(sql2, postObject2, (err, result)=> { // Write to database
					if(err) { 
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/" + req.body.title + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
		  		console.log(err);
				});

				console.log("Added image: " + req.body.title+ i + ".png")
			}
		}
	});

})

// edit post
app.put('/edit_post/:id', function (req, res) {
    const id = string(req.params["id"]);
    const title = string(req.body.title);
    const descr = string(req.body.descr);

    const sql = 'UPDATE posts SET title='+title+', descr='+descr+' WHERE id='+id;

    connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Post updated");
		}
	});

})

// delete post (status 0)
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


// ADMIN ROUNTING --------------------------------------------------------------------

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
    res.sendFile(path.join(__dirname + '/admin/all.html'));
});
app.get('/admin_new', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/new.html'));
});
app.get('/admin_delete', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/delete.html'));
});
app.get('/uploadfile_js', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/js/uploadfile.js'));
});



// PARCEL BUNDLER ----------------------------------------------------------------------

const file = 'src/index3.html'; // Pass an absolute path to the entrypoint here
const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
const bundler = new Bundler(file, options);

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

// PAGE ROUTING ----------------------------------------------------------------------
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/index3.html'));
});



// SERVER PORT --------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})