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


	var fg = colors[0].length ? hex2Address(colors[0]) : false;
	var bg = colors[1] ? hex2Address(colors[1]) : false;

		//When called, overwrite the substring method to ignore the added characters
	String.prototype.substring = function(start,end) {
			if(start === end) return '';
			if(!end) end = this.length;
			var text = '';
			var raw = this.split('');
			var index = 0;
			var inEscape = false;
			var curChar;
			var currentCommand = '';
			while(index < start) {
				curChar = raw.shift();
				if(inEscape) {
					currentCommand += curChar;
					if(curChar === 'm') {
						inEscape = false;
					}
					continue;
				} else {
					if(curChar === '\u001B') {
						inEscape = true;
						currentCommand = curChar;
						continue;
					}
					index++;
				}
			}	

			//If there is current formatting, apply it.
			if(currentCommand !== '\u001B[0m') {
				text += currentCommand;
			}	

			while(index < end && raw.length) {

				curChar = raw.shift();
				text += curChar;
				if(inEscape) {
					if(curChar === 'm') {
						inEscape = false;
					}
					continue;
				} else {
					if(curChar === '\u001B') {
						inEscape = true;
						continue;
					}
				}
				index++;
			}
			return text;
		};

	
	String.prototype.__defineGetter__(name,function() {
		var raw = this.replace(/\u001B(?:.*)m/,'');
		var result = '';
		if(fg) result += '\u001B[38;5;' + fg + 'm';
		if(bg) result += '\u001B[48;5;' + bg + 'm';
		result += raw + '\u001B[0m';
		return result;
	});
	}
};

function hex2Address(hex) {
	var rgb = hex2rgbString(hex);
	var nums = rgbRegExp.exec(rgb);
	return x256(parseInt(nums[1]),parseInt(nums[2]),parseInt(nums[3]));
}
