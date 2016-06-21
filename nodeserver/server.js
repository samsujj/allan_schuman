/**
 * Created by iftekar on 24/5/16.
 */


var express = require('express');

//var busboy = require('connect-busboy'); //middleware for form/file upload
//var path = require('path');     //used for file path
//var fs = require('fs-extra');
var app = express();
//app.use(busboy());// create our app w/ express
//var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 1033; 				// set the port
//var database = require('./config/database'); 			// load the database config
//var morgan = require('morgan');
/*var bodyParser = require('body-parser');
var methodOverride = require('method-override');*/

/*// configuration ===============================================================
//mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
//app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request*/


var http = require('http').Server(app);





var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 1000000,
    limit: 1024 * 1024 * 10}));
app.use(bodyParser.urlencoded({ parameterLimit: 1000000,
    limit: 1024 * 1024 * 10, extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        //console.log(file);
        filename=file.originalname.split('.')[0].replace(' ','') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, filename);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
//app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request*/

/*app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies*/


// routes ======================================================================
//require('./app/routes.js')(app);

// listen (start app with node nodeserver.js) ======================================




app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



/** API path that will upload the files */
app.post('/uploads', function(req, res) {

    datetimestamp = Date.now();
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,filename:filename});
    });
});

var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/testdb';

var MongoClient = mongodb.MongoClient;




/*var mysql=require('mysql');

var connection =mysql.createConnection({
    host:'influxiq.com',
    user:'influxiq_urbanh',
    password:'P@ss7890',
    database:'influxiq_hhealing'

});

connection.connect(function(error){

    if(!!error){
        console.log('error')
    } else{
        console.log('connected');
    }

});*/

app.get('/',function(req,resp){

    /*connection.query("SELECT * FROM contentmanager ",function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });*/




    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to mongo db', url);


            var collection = db.collection('users');

            //Create some users
            var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
            var user2 = {name: 'modulus user', age: 22, roles: ['user']};
            var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

            // Insert some users
            collection.insert([user1, user2, user3], function (err, result) {
                if (err) {
                    console.log(err);
                    console.log('err-----mingo .. vag ');
                } else {
                    //console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    ///resp.send(JSON.stringify(collection.find()));

                    /*collection.find({},function(err,docs){

                        console.log(docs.name);

                    });*/
                    var dbresults= [];

                    collection.find().toArray(function(err, items) {

                        console.log(items);
                        console.log('-----------------------------------');
                        console.log(items.length);
                        resp.send(JSON.stringify(items));
                        ///dbresults.push(items);
                    });

                    /*console.log(dbresults);
                    resp.send(JSON.stringify(dbresults));*/

                    /*var findRestaurants = function(db, callback) {
                        var cursor =collection('users').find();
                        //resp.send(JSON.stringify(cursor));
                        cursor.each(function(err, doc) {
                            assert.equal(err, null);
                            if (doc != null) {
                                console.log(doc);
                            } else {
                                console.log('cb again');
                                callback();
                            }
                        });
                    };*/
                    //db.close();
                }
            });

            // do some work here with the database.

            //Close connection
            //db.close();
        }
    });

    //resp.send(JSON.stringify('4545'));
});



app.get('/contentlist', function (req, resp) {
    /*connection.query("SELECT * FROM contentmanager ",function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });*/





    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to mongo db', url);


            var collection = db.collection('content_table_allanschuman');

            //Create some users
            var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
            var user2 = {name: 'modulus user', age: 22, roles: ['user']};
            var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

            // fetch some users


            collection.find().toArray(function(err, items) {

                console.log(items);
                console.log('-----------------------------------');
                console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });




            // do some work here with the database.

            //Close connection
            //db.close();
        }
    });




});


app.get('/contentlistbyid/:id', function (req, resp) {
    connection.query("SELECT * FROM contentmanager where id = ? or parentid = ?",[req.params.id,req.params.id],function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });
});





app.post('/addcontent', function (req, resp) {



   /* res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
*/

    var content='';
    if(req.body.ctype=='html') content= (req.body.chtml);
    if(req.body.ctype=='text') content= (req.body.ctext);
    if(req.body.ctype=='image') content= req.body.image_url_url;

    ///console.log(JSON.parse(content));
    if(typeof (req.body.parentid)=='undefined') var parentid=0;
    else var parentid=req.body.parentid;
    var addtime=Date.now();

    value1 = {cname: req.body.cname, content: content, ctype: req.body.ctype,description:req.body.description,parentid:parentid,addtime:addtime};
console.log("Insert command");



    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to mongo db', url);


            var collection = db.collection('content_table_allanschuman');

            //Create some users
            /*var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
            var user2 = {name: 'modulus user', age: 22, roles: ['user']};
            var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};*/

            // Insert some users
            collection.insert([value1], function (err, result) {
                if (err) {
                    console.log(err);
                    console.log('err-----mingo .. vag ');
                } else {
                    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

                    //db.close();
                    /*resp.send((req));*/
                }
            });

            // do some work here with the database.

            //Close connection
            //db.close();
        }
    });





/*connection.query('INSERT INTO contentmanager SET ?', value1, function (err,result) {
    if (err) {
        console.log("ERROR IN QUERY");
    } else {
        console.log("Insertion Successful." + result);
        console.log('Inserted ' + result.affectedRows + ' rows');
        resp.send(result);
    }
});*/
    //resp.send((req));


});



app.post('/upload',function(req, res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log(req.body.Filedata);
    console.log(JSON.stringify(req));



    var tmp_path = req.files.Filedata.path;
    // set where the file should actually exists
    var target_path = './uploads/' + req.files.Filedata.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                throw err;
            }else{
                var profile_pic = req.files.userPhoto.name;
                //use profile_pic to do other stuffs like update DB or write rendering logic here.
            };
        });
    });
});


var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})

//app.listen(port);

/*app.listen(port);
console.log("App listening on port " + port);*/
