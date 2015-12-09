### Introduction

 This is a Message Pub/Sub library, enqueue from HTTP, dequeue from TCP Socket.
 
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
    var _ = require('ovaldi');

	var hub = _.getHub();

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
    var _ = require('ovaldi');

	var ctx = _.getContext('http://127.0.0.1:3001');

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
		//ctx.destroy();
	});
```
