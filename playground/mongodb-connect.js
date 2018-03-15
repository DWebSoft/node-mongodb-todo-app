const MongoClient = require('mongodb').MongoClient;

//Object Destructuring
// var user = { name: 'Durgesh' , age: 23 }
// var {name} = user

//Connection URL
const url = "mongodb://localhost:27017";

//Database Name
const dbName = "TodoApp";
MongoClient.connect( url, (err, client) => {
    if ( err ) {
        return console.log('Unable to connect to database server');
    }
    console.log('Connected to database server');
    const db = client.db( dbName ); 

    // db.collection('Todos').insertOne({
    //     text : 'Something todo',
    //     completed : false
    // }, (err, result) => {
    //     if ( err ) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Insert a new User
    db.collection('Users').insertOne({
        name : 'Durgesh',
        age : 23,
        location : 'Pune'
    }, (err, result) => {
        if ( err ) {
            return console.log('Unable to insert user', err);
        }
       // console.log(JSON.stringify(result.ops, undefined, 2));
       console.log(result.ops[0]._id.getTimestamp());
    })
    client.close(); 
});