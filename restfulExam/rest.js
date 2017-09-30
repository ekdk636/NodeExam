var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));

//var users = [];

// MySQL 접속
var mysql = require('mysql');
var connection = mysql.createConnection
({
  	  host     : 'localhost'
  	, user     : 'root'
  	, password : 'test1234'
  	, database : 'restful'
});

connection.connect();

app.get('/user', function(req, res)
{
	//res.send(JSON.stringify(users));

	connection.query('select * from user', function(err, results, fields)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			res.send(JSON.stringify(results));
		}
	});
});

app.get('/user/:id', function(req, res)
{
	connection.query('select * from user where id=?', [req.params.id], function(err, results, fields)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			if(results.length > 0)
			{
				res.send(JSON.stringify(results[0]));
			}
			else
			{
				res.send(JSON.stringify({}));
			}
		}
	});
	/*
	var select_idx = -1;

	for(var i=0; i<users.length; i++)
	{
		var obj = users[i];

		if(obj.id == Number(req.params.id))
		{
			select_idx = i;
			break;
		}
	}

	if(select_idx == -1)
	{
		res.send(JSON.stringify({}));
	}
	else
	{
		res.send(JSON.stringify(users[select_idx]));
	}
	*/
});

app.post('/user', function(req, res)
{
	connection.query('insert into user(name, age) values (?, ?)', [req.body.name, req.body.age]
	, function(err, result)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			res.send(JSON.stringify(result));
		}
	});

	/*
	var name = req.body.name;
	var age = Number(req.body.age);
	var obj = {id:users.length+1, name:name, age:age};

	console.log(name);
	console.log(age);

	users.push(obj);

	res.send(JSON.stringify({result:true, api:'add user info'}));
	*/
});

app.put('/user/:id', function(req, res)
{
	connection.query('update user set name=?, age=? where id=?', [req.body.name, req.body.age, req.params.id]
	, function(err, result)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			res.send(JSON.stringify(result));
		}
	});

	/*
	var select_idx = -1;

	for(var i=0; i<users.length; i++)
	{
		var obj = users[i];

		if(obj.id == Number(req.params.id))
		{
			select_idx = i;
			break;
		}
	}

	if(select_idx == -1)
	{
		res.send(JSON.stringify({result:false}));
	}
	else
	{
		var name = req.body.name;
		var age = Number(req.body.age);
		var obj = {id:Number(req.params.id), name:name, age:age};
		users[select_idx] = obj;
		res.send(JSON.stringify({result:true}));
	}
	*/
	//res.send(JSON.stringify({api:'modify user info'}));
});

app.delete('/user/:id', function(req, res)
{
	connection.query('delete from user where id=?', [req.params.id], function(err, result)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			res.send(JSON.stringify(result));
		}
	});

	/*
	var select_idx = -1;

	for(var i=0; i<users.length; i++)
	{
		var obj = users[i];

		if(obj.id == Number(req.params.id))
		{
			select_idx = i;
			break;
		}
	}

	if(select_idx == -1)
	{
		res.send(JSON.stringify({result:false}));
	}
	else
	{
		users.splice(select_idx, 1);
		res.send(JSON.stringify({result:true}));
	}
	*/

	//res.send(JSON.stringify({api:'delete user info', id:req.params.id}));
});

// MongoDB 접속
var mongodb = require('mongodb');

var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/restful';
var dbObj = null;

mongoClient.connect(url, function(err, db)
{
	console.log('Connected correctly to server');
	dbObj = db;
});

app.get('/message', function(req, res)
{
	//console.log(req.query.sender_id);

	var condition = {};

	if(req.query.sender_id != undefined)
	{
		condition = {sender_id:req.query.sender_id};
	}

	var messages = dbObj.collection('messages');

	messages.find(condition).toArray(function(err, results)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			res.send(JSON.stringify(results));
		}
	});
});

var objectID = require('mongodb').ObjectID;

app.get('/message/:id', function(req, res)
{
	var messages = dbObj.collection('messages');

	messages.findOne({_id:objectID.createFromHexString(req.params.id)}, function(err, result)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			res.send(JSON.stringify(result));
		}
	});
});

app.post('/message', function(req, res)
{
	console.log(req.body.sender_id);
	console.log(req.body.receiver_id);
	console.log(req.body.message);

	connection.query('select id, name from user where id=? or id=?', [req.body.sender_id, req.body.receiver_id]
	, function(err, results, fields)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			var sender = {};
			var receiver = {};

			for(var i=0; i<results.length; i++)
			{
				if(results[i].id == Number(req.body.sender_id))
				{
					sender = results[i];
				}
				
				if(results[i].id == Number(req.body.receiver_id))
				{
					receiver = results[i];
				}
			}

			var object =
			{
				  sender_id : req.body.sender_id
				, receiver_id : req.body.receiver_id
				, sender : sender
				, receiver : receiver
				, message : req.body.message
				, created_at : new Date()
			}

			var messages = dbObj.collection('messages');
			messages.save(object, function(err, result)
			{
				if(err)
				{
					res.send(JSON.stringify(err));
				}
				else
				{
					res.send(JSON.stringify(result));
				}
			});
		}
	});
});

app.delete('/message/:id', function(req, res)
{
	var messages = dbObj.collection('messages');

	messages.remove({_id:objectID.createFromHexString(req.params.id)}, function(err, result)
	{
		if(err)
		{
			res.send(JSON.stringify(err));
		}
		else
		{
			res.send(JSON.stringify(result));
		}
	});
});

app.listen(52273, function()
{
	console.log('Server Running!!');
});