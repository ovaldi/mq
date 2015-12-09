var ovaldi = require('../index.js');

var ctx = ovaldi.getContext('http://127.0.0.1:3001');

ctx.on('ready', () => {
	console.log('ctx ready');

	ctx.connect('channel', channel => {

		console.log('channel connected: channel');

		var subscriber = channel.subscribe('topic', data => {
			console.log(data);
		});

		console.log('subscribed: topic');

		//unsubscribe
		//subscriber.unsubscribe();
	});

	ctx.connect('orders', channel => {

		console.log('channel connected: orders');

		var subscriber = channel.subscribe('create.order', data => {
			console.log(data);
		});

		console.log('subscribed: create.order');
	});

	ctx.on('close', () => {
		console.log('ctx: closed');
	});

	process.on('SIGINT', () => {
		ctx.destroy();
		process.exit(0);
	});
});