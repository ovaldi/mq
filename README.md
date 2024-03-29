### Introduction

 This is a Message Pub/Sub library, enqueue from HTTP, dequeue from TCP Socket.

### Installation 

```
	npm install ovaldi
```
 
### Runing tests
 	
 Start server:
 ```
    $ node examples/server.js
 ```   
 Start client:
 ```    
    $ node examples/client.js
 ```
 Start publisher:
 ```
    $ node examples/publisher.js
 ```
### Example (Server-side)
```js
    var ovaldi = require('ovaldi');

	var hub = ovaldi.getHub();

	hub
		.createChannel('channel')
	 	.createChannel('orders')
 		.listen(3001)
		.then(()=>{
			console.log('server: ready');	
	 	});
```
### Example (Client-side)

```js
    var ovaldi = require('ovaldi');

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

		//destroy context
		process.on('SIGINT', () => {
			ctx.destroy();
			process.exit(0);
		});
	});
```
