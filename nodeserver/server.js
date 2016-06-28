/**
 * Created by iftekar on 24/5/16.
 */

//var CryptoJS = require("crypto-js");
var CryptoJS = require("crypto-js/aes");




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
app.use(bodyParser.json({ parameterLimit: 10000000,
    limit: '90mb'}));
app.use(bodyParser.urlencoded({ parameterLimit: 10000000,
    limit: '90mb', extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
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

//app.use(express.limit('4M'));


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
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);


            var collection = db.collection('users');

            //Create some users
            var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
            var user2 = {name: 'modulus user', age: 22, roles: ['user']};
            var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

            // Insert some users
            collection.insert([user1, user2, user3], function (err, result) {
                if (err) {
                  //  console.log(err);
                //    console.log('err-----mingo .. vag ');
                } else {
                    //console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    ///resp.send(JSON.stringify(collection.find()));

                    /*collection.find({},function(err,docs){

                        console.log(docs.name);

                    });*/
                    var dbresults= [];

                    collection.find().toArray(function(err, items) {

                      //  console.log(items);
                     //   console.log('-----------------------------------');
                     //   console.log(items.length);

                        var crypto = require('crypto');

                        var secret = '123456';
                        var hash = crypto.createHmac('sha256', secret)
                            .update('I love cupcakes')
                            .digest('hex');
                        resp.send(hash);

                       // resp.send(CryptoJS.AES.encrypt("123", "Key1"));

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


    MongoClient.connect(url, function (err, db) {
        if (err) {
          //  console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
           // console.log('Connection established to mongo db', url);


            var collection = db.collection('content_table_allanschuman');

            //Create some users
            var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
            var user2 = {name: 'modulus user', age: 22, roles: ['user']};
            var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

            // fetch some users


            collection.find().toArray(function(err, items) {

             //   console.log(items);
             //   console.log('-----------------------------------');
            //    console.log(items.length);
                resp.send(JSON.stringify(items));
                db.close();
                ///dbresults.push(items);
            });




            // do some work here with the database.

            //Close connection
            //db.close();
        }
    });




});


app.get('/contentlistbyid/:id', function (req, resp) {
    /*connection.query("SELECT * FROM contentmanager where id = ? or parentid = ?",[req.params.id,req.params.id],function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });*/


    MongoClient.connect(url, function (err, db) {
        if (err) {
          //  console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

         //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.params.id);

            var collection = db.collection('content_table_allanschuman');

            collection.find({$or: [ { _id: o_id }, { parentid: req.params.id } ]}).toArray(function(err, items) {

              //  console.log(items);
             //   console.log('-----------------------------------');
              //  console.log(items.length);
                resp.send(JSON.stringify(items));
                db.close();

            });


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
//console.log("Insert command");



    MongoClient.connect(url, function (err, db) {
        if (err) {
          //  console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);


            var collection = db.collection('content_table_allanschuman');

            //Create some users
            /*var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
            var user2 = {name: 'modulus user', age: 22, roles: ['user']};
            var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};*/

            // Insert some users
            collection.insert([value1], function (err, result) {
                if (err) {
                 //   console.log(err);
                 //   console.log('err-----mingo .. vag ');
                } else {
                  //  console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

                    db.close();
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

app.post('/addcontact', function (req, resp) {



   /* res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
*/

    var addtime=Date.now();

    value1 = {address: req.body.address, comments: req.body.comments, email: req.body.email,fullname:req.body.fullname,interest:req.body.interest,phone:req.body.phone};
//console.log("Insert command");



    MongoClient.connect(url, function (err, db) {
        if (err) {
           // console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);


            var collection = db.collection('contacttable');

            //Create some users
            /*var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
            var user2 = {name: 'modulus user', age: 22, roles: ['user']};
            var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};*/

            // Insert some users
            collection.insert([value1], function (err, result) {
                if (err) {
                  //  console.log(err);
                  //  console.log('err-----mingo .. vag ');
                } else {
                  //  console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


                    var mailer = require("nodemailer");

                    // Use Smtp Protocol to send Email
                    var smtpTransport = mailer.createTransport("SMTP",{
                        service: "Gmail",
                        auth: {
                            user: "itplcc40@gmail.com",
                            pass: "DevelP7@"
                        }
                    });

                    var mail = {
                        from: req.body.fullname+" <"+req.body.email+">",
                        to: "debasiskar007@gmail.com,debasis218@gmail.com",
                        subject: "New Contact Form Submission by "+req.body.fullname+" on allanschuman.com",
                        //text: "Node.js New world for me",
                        html: "<b>Name</b> :   "+req.body.fullname +"<br><b>Email</b> :   "+req.body.email+ "<br><b>Phone Number</b> :   "+req.body.phone +"<br><b>Address</b> :   "+req.body.address+"<br><b>Interest</b> :   "+req.body.interest+"<br><b>Message</b> :   "+req.body.comments
                    }

                    smtpTransport.sendMail(mail, function(error, response){
                        if(error){
                          //  console.log(error);
                        }else{
                          //  console.log("Message sent: " + response.message);
                        }

                        resp.send((response.message));
                        smtpTransport.close();
                    });

                   // console.log('success full query');
                    //resp.send('Hello'+rows[0].fname);
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





app.post('/rolelist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
          //  console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
         //   console.log('Connection established to mongo db', url);

            var collection = db.collection('user_role');

            collection.find().toArray(function(err, items) {

             //   console.log(items);
             //   console.log('-----------------------------------');
              //  console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });


            //db.close();
        }
    });




});
app.post('/contactlist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
           // console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);

            var collection = db.collection('contacttable');

            collection.find().toArray(function(err, items) {

           //     console.log(items);
           //     console.log('-----------------------------------');
           //     console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });


            //db.close();
        }
    });




});

app.post('/articlelist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
         //   console.log('Connection established to mongo db', url);

            var collection = db.collection('article');

            collection.find().toArray(function(err, items) {

             //   console.log(items);
             //   console.log('-----------------------------------');
             //   console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });


            //db.close();
        }
    });




});

app.post('/login', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);

            var collection = db.collection('userstable');

            var crypto = require('crypto');

            var secret = req.body.password;
            var hash = crypto.createHmac('sha256', secret)
                .update('password')
                .digest('hex');

            collection.find({email:req.body.email,password:hash}).toArray(function(err, items) {

            //    console.log(items);
            //    console.log('-----------------------------------');
            //    console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });


            //db.close();
        }
    });




});

app.get('/adminlist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);

            var collection = db.collection('userstable');

            collection.find().toArray(function(err, items) {

             //   console.log(items);
             //   console.log('-----------------------------------');
             //   console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });


            //db.close();
        }
    });




});


app.get('/medialist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
         //   console.log('Connection established to mongo db', url);

            var collection = db.collection('media_youtube');

            collection.find().toArray(function(err, items) {

         //       console.log(items);
         //       console.log('-----------------------------------');
         //       console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });


            //db.close();
        }
    });




});

app.get('/stafflist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
         //   console.log('Connection established to mongo db', url);

            var collection = db.collection('staff');

            collection.find().toArray(function(err, items) {

          //      console.log(items);
          //      console.log('-----------------------------------');
          //      console.log(items.length);
                resp.send(JSON.stringify(items));
                ///dbresults.push(items);
            });


            //db.close();
        }
    });




});

app.post('/addrole', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {role: req.body.role, addtime: addtime, role_status: role_status};
 //   console.log("Insert command");



    MongoClient.connect(url, function (err, db) {
        if (err) {
    //       console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
    //        console.log('Connection established to mongo db', url);


            var collection = db.collection('user_role');


            collection.insert([value1], function (err, result) {
                if (err) {
        //            console.log(err);
        //            console.log('err-----mingo .. vag ');
                } else {
         //           console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


                }
            });


        }
    });


});

app.post('/addadmin', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    value1 = {fname: req.body.fname, lname: req.body.lname, email: req.body.email,password:hash,address:req.body.address,phone_no:req.body.phone_no,mobile_no:req.body.mobile_no,status:1,create_time:req.addtime};
   // console.log("Insert command");


    MongoClient.connect(url, function (err, db) {
        if (err) {
      //      console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
       //     console.log('Connection established to mongo db', url);


            var collection = db.collection('userstable');


            collection.insert([value1], function (err, result) {
                if (err) {
             //       console.log(err);
             //       console.log('err-----mingo .. vag ');
                } else {
              //      console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


                }
            });


        }
    });


});

app.post('/addstaff', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {title: req.body.title, designation: req.body.designation, email: req.body.email,phone:req.body.phone,description:req.body.description,picture:req.body.picture,type:req.body.type,status:1,create_time:req.addtime,featured:req.body.featured,priority:req.body.priority};
  //  console.log("Insert command");


    MongoClient.connect(url, function (err, db) {
        if (err) {
       //     console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
      //      console.log('Connection established to mongo db', url);


            var collection = db.collection('staff');


            collection.insert([value1], function (err, result) {
                if (err) {
         //           console.log(err);
          //          console.log('err-----mingo .. vag ');
                } else {
           //         console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


                }
            });


        }
    });


});

app.post('/addarticle', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {title: req.body.title,description: req.body.description, createdby: req.body.createdby,createdtime:addtime,image: req.body.image,status: 1,video: req.body.video };


    MongoClient.connect(url, function (err, db) {
        if (err) {
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
         //   console.log('Connection established to mongo db', url);


            var collection = db.collection('article');


            collection.insert([value1], function (err, result) {
                if (err) {
               //     console.log(err);
                //    console.log('err-----mingo .. vag ');
                } else {
                //    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


                }
            });


        }
    });


});


app.post('/addmedia', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {media_name: req.body.media_name,media_file: req.body.media_file, priority: req.body.priority,status: 1,priority: req.body.priority,status: 1,add_time: addtime };
  //  console.log("Insert command");


    MongoClient.connect(url, function (err, db) {
        if (err) {
      //      console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
       //     console.log('Connection established to mongo db', url);


            var collection = db.collection('media_youtube');


            collection.insert([value1], function (err, result) {
                if (err) {
        //            console.log(err);
        //            console.log('err-----mingo .. vag ');
                } else {
          ///          console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


                }
            });


        }
    });


});




app.get('/roledetails/:id', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

          //  console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.params.id);

            var collection = db.collection('user_role');

            collection.find({_id:o_id}).toArray(function(err, items) {

            //    console.log(items);
          //      console.log('-----------------------------------');
          //      console.log(items.length);
                resp.send(JSON.stringify(items));

            });


        }
    });

});
app.post('/admindetails', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

      //      console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');

            collection.find({_id:o_id}).toArray(function(err, items) {

            //    console.log(items);
            //    console.log('-----------------------------------');
            //    console.log(items.length);
                resp.send(JSON.stringify(items));

            });

        }
    });

});


app.post('/articledetails', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

         //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('article');

            collection.find({_id:o_id}).toArray(function(err, items) {

                console.log(items.length);
                resp.send(JSON.stringify(items));
                db.close();

            });

        }
    });

});

app.post('/staffdetails', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

         //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('staff');

            collection.find({_id:o_id}).toArray(function(err, items) {

           //     console.log(items);
           //     console.log('-----------------------------------');
            //    console.log(items.length);
                resp.send(JSON.stringify(items));

            });

        }
    });

});


app.post('/mediadetails', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
         //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

           // console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('media_youtube');

            collection.find({_id:o_id}).toArray(function(err, items) {

            //    console.log(items);
            //    console.log('-----------------------------------');
            //    console.log(items.length);
                resp.send(JSON.stringify(items));

            });

        }
    });

});



app.post('/deleterole', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

        //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('user_role');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});

app.post('/deletestaff', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

        //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('staff');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});


app.post('/deletearticle', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
          //  console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

          //  console.log('Connection established to mongo db', url);

            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('article');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});


app.post('/deletemedia', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

        //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('media_youtube');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});



app.post('/deleteadmin', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

         //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});

app.post('/roleupdates', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
       //     console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

        //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('user_role');
            collection.update({_id: o_id}, {$set: {role:req.body.role}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});

app.post('/adminupdates', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

         //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');
            collection.update({_id: o_id}, {$set: {fname: req.body.fname, lname: req.body.lname, email: req.body.email,address:req.body.address,phone_no:req.body.phone_no,mobile_no:req.body.mobile_no}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});
app.post('/staffupdates', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
       //     console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

        //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('staff');
            collection.update({_id: o_id}, {$set: {description: req.body.description,designation: req.body.designation,email: req.body.email,phone:req.body.phone,picture:req.body.picture,status:req.body.status,title:req.body.title,type:req.body.type,featured:req.body.featured,priority:req.body.priority }},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});


app.post('/mediaupdates', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
       //     console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

       //     console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('media_youtube');
            collection.update({_id: o_id}, {$set: {media_name: req.body.media_name,media_file: req.body.media_file,priority: req.body.priority }},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});
app.post('/articleupdates', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
        //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

       //     console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('article');
            collection.update({_id: o_id}, {$set: {title: req.body.title,description: req.body.description,image: req.body.image,status:req.body.status,createdby:req.body.createdby,video:req.body.video }},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});




app.post('/adminupdatestatus', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

     //       console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('userstable');
            collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});

app.post('/articleupdatestatus', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
       //     console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

      //      console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('article');
            collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});
app.post('/staffupdatestatus', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

      //      console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('staff');
            collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});


app.post('/mediaupdatestatus', function (req, resp) {
   MongoClient.connect(url, function (err, db) {
        if (err) {
      //      console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

       //     console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('media_youtube');
            collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});


/****************Banner Module[start]**************/

app.post('/bannerlist', function (req, resp) {

    MongoClient.connect(url, function (err, db) {
        if (err) {
          //  console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);

            var collection = db.collection('banner_db');

            collection.find().toArray(function(err, items) {

               resp.send(JSON.stringify(items));
                db.close();
            });


            //db.close();
        }
    });




});

app.post('/bannerdetails', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

            //   console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('banner_db');

            collection.find({_id:o_id}).toArray(function(err, items) {

                //     console.log(items);
                //     console.log('-----------------------------------');
                //    console.log(items.length);
                resp.send(JSON.stringify(items));
                db.close();

            });

        }
    });

});


app.post('/addbanner', function (req, resp) {

    value1 = {bannerfile: req.body.file, priority: req.body.priority,status: 1};

    MongoClient.connect(url, function (err, db) {
        if (err) {
         ///   console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
          //  console.log('Connection established to mongo db', url);


            var collection = db.collection('banner_db');


            collection.insert([value1], function (err, result) {
                if (err) {
                    resp.send(err);
                } else {
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    db.close();
                }
            });


        }
    });


});

app.post('/bannerupdates', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //     console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

            //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('banner_db');
            collection.update({_id: o_id}, {$set: {status:req.body.status,bannerfile: req.body.file, priority: req.body.priority }},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});


app.post('/bannerupdatestatus', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //       console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

            //      console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('banner_db');
            collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});

app.post('/deletebanner', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //    console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

            //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('banner_db');
            collection.deleteOne({_id: o_id}, function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else resp.send("success");
            });


        }
    });

});


/****************Banner Module[end]**************/



app.post('/upload',function(req, res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
   // console.log(req.body.Filedata);
 //   console.log(JSON.stringify(req));



    var tmp_path = req.files.Filedata.path;
    // set where the file should actually exists
    var target_path = './uploads/' + req.files.Filedata.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                res.send( err);
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

  //  console.log("Example app listening at http://%s:%s", host, port)

})

//app.listen(port);

/*app.listen(port);
console.log("App listening on port " + port);*/
