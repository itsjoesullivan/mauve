var hex2rgbString = require('rgb'),
	x256 = require('x256'),
	rgbRegExp = /(\d+),(\d+),(\d+)/;

/*

	mauve does colors stuff, but with less error checking + all 256 xterm colors rendered from hex

*/
var mauve = module.exports = {

	// Pass k, v of item name and ideal color
	set :  function(name,color) 	{
	//Allow setting via a hash, i.e. "set theme"
	if(typeof name === 'object') {
		for(var i in name) {
			this.set(i,name[i]);
		}
		return;
	}

	var rgb = hex2rgbString(color),
		nums = rgbRegExp.exec(rgb),
		address = x256(parseInt(nums[1]),parseInt(nums[2]),parseInt(nums[3]));
	
	console.log(name, address);
	String.prototype.__defineGetter__(name,function() {
		return '\u001B[38;5;' + address + 'm' + this + '\u001B[0m';
	});
	}
};
