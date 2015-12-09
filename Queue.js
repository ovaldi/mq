var _ = require('lodash');
var Q = require('q');

function Queue(){
	this._hub = [];
}

_.extend(Queue.prototype, {
	enqueue: function(item){
		this._hub.push(item);
	},
	dequeue: function(){
		var defer = Q.defer();
		var item  = this._hub.shift();
		defer.resolve(item);

		//统一返回Promise对象，保留异步存取Queue的可能性
		return defer.promise;
	},
	clear: function(){
		this._hub = [];
	}
});

module.exports = Queue;