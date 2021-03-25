const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const unirest = require('unirest');


const {router: usersRouter} = require('./router');
// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require('./config');


const {UserContact} = require('./models');
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/spin', express.static(__dirname + '/node_modules/spin/'));

app.use('/moment', express.static(__dirname + '/node_modules/moment/'));
app.use(morgan('common'));
app.use('/users', usersRouter);

app.get('/contacts', (req, res) => {
  console.log("req.query"+JSON.stringify(req.query));
  UserContact
    .find(
     req.query
      )
    // `exec` returns a promise
    .exec()
    // success callback: for each restaurant we got back, we'll
    // call the `.apiRepr` instance method we've created in
    // models.js in order to only expose the data we want the API return.
    .then(users => {
      res.json({
        users: users[0].contacts.map(
          (user) => user.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.post('/contacts/add', (req, res) => {

  const requiredFields = [ 'name','phone'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  UserContact.find({"userId" : req.body.userId}, function (err, users){

    if (!err) {
        //we can remove a user by Id rather than looping over an array 
        //console.log("users[0] is "+users[0].contacts)
        var contacts=users[0].contacts;
        var newContact={
         name: req.body.name,
         gender: req.body.gender,
         username: req.body.username,
         email: req.body.email,
         address: req.body.address,
         phone: req.body.phone, 
         age: req.body.age,
         company:req.body.company
    }
    contacts.push(newContact);
        users[0].contacts=contacts;
        users[0].save(function (err) {
              console.log("Error  is "+err);
           });
      }
 
}).then(userDetail => res.status(201).json(userDetail[0].contacts))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

app.put('/contacts/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
 UserContact.find({"userId" : req.body.userId}, function (err, users){
    if (!err) {
        //we can remove a user by Id rather than looping over an array 
        //console.log("users[0] is "+users[0].contacts)
        var contacts=users[0].contacts;

           for (i in contacts) {
                var id= contacts[i]._id;
                
                //console.log("Id is  "+id);
                if(id==req.params.id)
                {
                  contacts[i].phone=req.body.phone;
contacts[i].gender=req.body.gender;
contacts[i].age=req.body.age;
contacts[i].company=req.body.company;
contacts[i].email=req.body.email;
contacts[i].name.firstName=req.body.firstName;
contacts[i].name.lastName=req.body.lastName;
contacts[i].address.city=req.body.city;
contacts[i].address.state=req.body.state;
contacts[i].address.zipcode=req.body.zipcode;
contacts[i].address.country=req.body.country;
                  
                }
          }
        users[0].contacts=contacts;
        users[0].save(function (err) {
              // do something
              console.log("Data Saved Successfully  "+err);
           });
      }
 
}).then(updateData => res.status(201).json(updateData[0].contacts))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


app.delete('/contacts/:id', (req, res) => {
  
  UserContact.find({"userId" : req.body.userId}, function (err, users) {        
    if (!err) {
        //we can remove a user by Id rather than looping over an array 
        //console.log("users[0] is "+users[0].contacts)
        var contacts=users[0].contacts;
        for (i in contacts) {
                var id= contacts[i]._id;
                if(id==req.params.id)
                {
                  contacts.splice(i,1);
                }
          }
        users[0].contacts=contacts;
        //users[0].contacts(contacts).remove();
        users[0].save(function (err) {
              // do something
              console.log("Error  is "+err);
           });
      }
}).exec()
    .then(() => {
      console.log(`Deleted users  with id \`${req.params.id}\``);
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });

 
});

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {



  return new Promise((resolve, reject) => {

    mongoose.connect(databaseUrl,err => {
    console.log("Connected to DB");
      if (err) {
        return reject(err);
      }

        //const UserContact = client.db("contactApp").collection("userContacts");
//        UserContact.find({userId: "surbhi"}, function(err, docs) {
//            docs.each(function(err, doc) {
//              if(doc) {
//                console.log("Printing docs", doc);
//              }
//              else {
//              console.log("No  docs", doc);
////                res.end();
//              }
//            });
//          });
//
//        console.log("Printing UserContact******",UserContact)
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
      mongoose.disconnect();
        client.close();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return client.close().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
