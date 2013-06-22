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

	var colors = color.split('/');


	var fg = hex2Address(color[0]);
	var bg = color[1] ? hex2Address(color[1]) : false;
	
	
	String.prototype.__defineGetter__(name,function() {
		var result = '';
		result += '\u001B[38;5;' + fg + 'm';
		if(bg) result += '\u001B[48;5;' + bg + 'm';
		result += this + '\u001B[0m';
		return result;
	});
	}
};

function hex2Address(hex) {
	var rgb = hex2rgbString(hex);
	var nums = rgbRegExp.exec(rgb);
	return x256(parseInt(nums[1]),parseInt(nums[2]),parseInt(nums[3]));
}
