var _ 		= require('lodash');
var Q       = require('q');
var net		= require('net');
var http 	= require('http');
var koa 	= require('koa');
var parse	= require('co-body');
var logger 	= require('koa-logger');
var route 	= require('koa-route');
var serve 	= require('koa-static');
var io 		= require('socket.io');
var client  = require('socket.io-client');
var Queue   = require('./Queue');

module.exports = Hub;

function Hub(){
	this._channel2sockets = {};
	this._queue = new Queue();
}

_.extend(Hub.prototype, {
	_createHTTP: function(){
		var self  = this;
		var queue = self._queue;
		var app   = this._app = koa();

		//监听HTTP请求日志
		app.use(logger());

		//注册频道的HTTP路由
		_.each(self._channel2sockets, (value, channelName) => {
			app.use(route.post('/' + channelName, function *(){
				//TODO: 此处可以做一些权限验证，比如根据[HTTP headers]或者[domain白名单]做校验

				var json = yield parse(this);

				//enqueue
				queue.enqueue({
					channel: channelName,
					data: json
				});

				this.body = 'OK';
			}));
		});

		return this;
	},
	_createTCP: function(){
		var self = this;

		self._tcp = io({
			serveClient: false
		});

		self._tcp.on('connection', socket => {
			var addr = socket.remoteAddress, port = socket.remotePort;

			socket.on('error', err => {
				console.log(err.message);
			});

			socket.on('channel', data => {
				var list = self._channel2sockets[data.channel];
				if(list && list.indexOf(socket) === -1){
					list.push(socket);

					socket.on('disconnect', () => {
						list.splice(list.indexOf(socket), 1);
					});

					socket.emit(data.uuid);
				}
			});

		});

		return this;
	},
	createChannel: function(channelName){
		this._channel2sockets[channelName] = [];
		return this;
	},
	listen: function(port, host){
		var self  = this;
		var queue = self._queue;
		var defer = Q.defer();

		this._createHTTP()
			._createTCP();


		var server = http.createServer(self._app.callback());
		self._tcp.attach(server);

		server.listen(port, host || '127.0.0.1', () => {
			defer.resolve();
		});

		return defer.promise
		.then(() => {
			//开始分发消息
			dispatch();

			function dispatch(){
				setImmediate(() => {
					queue.dequeue()
					.then(item => {
						if(item){
							var list = self._channel2sockets[item.channel];
							if(list && list.length){
								list.forEach(socket => {
									socket.emit(item.data.topic, item.data.payload);
								});
							}
						}
					})
					.finally(() => {
						dispatch();	
					});
				});
			}
		});
	}
});