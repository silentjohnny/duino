var arduino = require('duino'),
    board = new arduino.Board({
    	debug: false
    });

var redLed = new arduino.Led({
  board: board,
  pin: 12
});

var yellowLed = new arduino.Led({
  board: board,
  pin: 13
});

var leds = {
	yellow: {
		led: yellowLed,
		state: 'on',
	},
	red: {
		led: redLed,
		state: 'off',
	}
};
	
function toggle(name) {
	console.log('toggle');
	if (leds[name]) {
		if ('off' == leds[name].state) {
			console.log(leds[name]);
			leds[name].state = 'on';
			leds[name].led.on();
		} else {
			console.log(leds[name]);
			leds[name].state = 'off';
			leds[name].led.off();
		}
	}
}
	
var button = new arduino.Button({
	board: board,
	pin: 11
});

button.on('down', function() {
	toggle('yellow');
	toggle('red');
});
