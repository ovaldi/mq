var Hub 	= require('./Hub');
var Context = require('./Context');

module.exports = {
	getHub: function(){
		return new Hub();
	},
	getContext: function(url){
		return new Context(url);
	}
};