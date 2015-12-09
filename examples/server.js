var _ = require('../index.js');

var hub = _.getHub();

hub
	.createChannel('channel')
 	.createChannel('orders')
 	.listen(3001)
	.then(()=>{
		console.log('server: ready');	
 	});