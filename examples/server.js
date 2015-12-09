var ovaldi = require('../index.js');

var hub = ovaldi.getHub();

hub
	.createChannel('channel')
 	.createChannel('orders')
 	.listen(3001)
	.then(()=>{
		console.log('server: ready');	
 	});