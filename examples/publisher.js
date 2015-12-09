var http = require('http');

var uid  = 1000;
var pid  = 2000;

var options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/channel',
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  }
};

function send(){
	var post_req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	      console.log('Response: ' + chunk);
	  });
	});

	post_req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	post_req.write(JSON.stringify({
		topic: "topic",
		payload:{
			uid: uid++,
			pid: pid++
		}
	}));
	post_req.end();

	setTimeout(function(){
		send();
	}, 1000);
}

send();