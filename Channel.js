module.exports = Channel;

function Channel(name, socket){
	this.name = name;
	this._socket = socket;
}

Channel.prototype.subscribe = function(topic, callback){
	var socket = this._socket;

	socket.on(topic, callback);

	return {
		unsubscribe: function(){
			socket.removeListener(topic, callback);
		}
	};
};