var crypto = require('crypto');

var password = 'test1234!@#$';
var shsum = crypto.createHash('sha256');
shsum.update(password);

var output = shsum.digest('hex');

console.log('=====================================================================================');
console.log('password= '+password);
console.log('hash= '+output);

var shsum2 = crypto.createHash('sha256');
shsum2.update('test1234~@##');

var output2 = shsum2.digest('hex');
console.log('wrong hash= '+output2);
console.log('=====================================================================================');

var secret_key = "sds12345";
var cipher = crypto.createCipher('aes192', secret_key);
cipher.update(password, 'utf8', 'base64');
var cipheredOutput = cipher.final('base64');

var decipher = crypto.createDecipher('aes192', secret_key);
decipher.update(cipheredOutput, 'base64', 'utf8');
var decipheredOutput = decipher.final('utf8');

console.log('ciphered password: '+cipheredOutput);
console.log('deciphered password: '+decipheredOutput);
console.log('=====================================================================================');

var fs = require('fs');
var data = {password:password, output:output, cipheredOutput:cipheredOutput};
fs.writeFile('password.txt', JSON.stringify(data), 'utf8',
	function(err)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log('write complete...');

			fs.readFile('password.txt', 'utf8',
				function(err, data)
				{
					if(err)
					{
						console.log(err);
					}
					else
					{
						console.log('data= '+data);
					}
					console.log('=====================================================================================');
				});
		}
	});


