var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var jade = require('jade');

http.createServer(function(request, response)
{
	if(request.method == "GET")
	{
		console.log(request.url+" GET");

		if(request.url == '/')
		{
			fs.readFile('index.html', function(err, data)
			{
				if(!err)
				{
					response.writeHead(200, {'Content-Type':'text/html'});
					response.end(data);
				}
				else
				{
					response.writeHead(404);
					response.end();
				}
			});
		}
		else if(request.url == '/ejs')
		{
			fs.readFile('template.ejs', 'utf8', function(err, data)
			{
				if(!err)
				{
					var html = ejs.render(data, {name:'Hong', description:'Hello, World for EJS'});

					response.writeHead(200, {'Content-Type':'text/html'});
					response.end(html);
				}
			});
		}
		else if(request.url == '/jade')
		{
			fs.readFile('template.jade', 'utf8', function(err, data)
			{
				if(!err)
				{
					var fn = jade.compile(data);
					var html = fn({name:'Hong', description:'Hello, World for JADE'});

					response.writeHead(200, {'Content-Type':'text/html'});
					response.end(html);
				}
			});
		}
	}
	else if(request.method == "POST")
	{
		console.log(request.url+" POST");
		request.on('data', function(data)
		{
			response.writeHead(200, {'Content-Type':'text/html'});
			response.end('<h1>' + data + '</h1>');
		});
	}
}).listen(52273, function()
{
	console.log('Server Running at http://127.0.0.1:52273');
});