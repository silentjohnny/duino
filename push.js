var arduino = require('duino'),
	request = require('request'),
	board = new arduino.Board({
		debug: false
	}),
	redLed = new arduino.Led({
		board: board,
		pin: 12
	}),
	yellowLed = new arduino.Led({
		board: board,
		pin: 13
	}),
	button = new arduino.Button({
		board: board,
		pin: 11
	}),
	timer = null,
	waitIndicator = function(on) {
		if (on) {
			var nextColor = 'red';
			timer = setInterval(function() {
				if ('red' == nextColor) {
					redLed.on();
					yellowLed.off();
					nextColor = 'yellow';
				} else {
					redLed.off();
					yellowLed.on();
					nextColor = 'red';
				}
			}, 1000);
		} else if (timer) {
			clearInterval(timer);
		}
	},
	applicationKey = 'fafabce43109b76d05cda2f8b8ab7e874bbc3f546c675db88d57284ebcf32bcd',
	token = '543508cf4a0aadc1f21ab862e9db5dea99a8b33e044c2e3e8782fcaa32076a78',
	buttonHandler = function() {
		// Switch off the leds
		console.log('down');
		waitIndicator(false);
		redLed.off();
		yellowLed.off();
		
		// Send a push to Notificare
		var notification = {
			message: "Arduino button pushed",
			fullMessage: "Somebody pushed the button on your Arduino",
			actions: [{
				id: "red",
				action: "Red Light",
				message: false
			},{
				id: "yellow",
				action: "Yellow Light",
				message: false
			}]
		};
		request.post({
			url: "https://apps.notifica.re/webhooks/arduino/" + applicationKey,
			qs: {
				token: token
			},
			json: true,
			body: notification
		}, function(err, res, body) {
			if (err) {
				redLed.fade(500);
			} else if (200 == res.statusCode) {
				waitIndicator(true);
			} else {
				redLed.fade(500);
			}
		});
	}

// Handle a button press
button.on('down', buttonHandler);

// Start when board is ready
board.on('ready', function(){
	console.log('ready');
	// Switch off the leds
	redLed.off();
	yellowLed.off();
});