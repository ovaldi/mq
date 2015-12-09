var Q       = require('q');
var net		= require('net');
var client  = require('socket.io-client');
var uuid    = require('node-uuid').v4;
var Channel = require('./Channel');
var util 	= require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = Context;

function Context(url){
	EventEmitter.call(this);

	var self = this;

	var conn = this._conn = client(url);

	conn.on('connect', () => {
		self.emit('ready');
	});

	conn.on('disconnect', () => {
		console.log('disconnected');
	});
}
util.inherits(Context, EventEmitter);

Context.prototype.connect = function(channelName, callback){
	var conn = this._conn, id = uuid();

	function listener(){
		conn.removeListener(id, listener);
		var channel = new Channel(channelName, conn);
		callback(channel);
	}

	conn.on(id, listener);

	//向服务端发送频道连接请求
	conn.emit('channel', {
		uuid: id,
		channel: channelName
	});
};

Context.prototype.destroy = function(){
	var conn = this._conn;
	if(conn && !conn.destroyed){
		conn.destroy();
	}
	this.emit('close');
};