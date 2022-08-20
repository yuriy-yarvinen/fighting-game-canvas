const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const gravity = 0.2;
const userColor = 'red';
const backgroundColor = 'black';

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
	constructor({ position, velocity, parameters, keys, lastKey }) {
		this.position = position;
		this.velocity = velocity;
		this.parameters = parameters;
		this.lastKey = lastKey;
		this.keys = keys;
	}

	draw() {
		context.fillStyle = userColor;
		context.fillRect(
			this.position.x,
			this.position.y,
			this.parameters.width,
			this.parameters.height
		)
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;

		if (this.position.x + this.parameters.width + this.velocity.x >= canvas.width) {
			this.position.x = canvas.width - this.parameters.width;
		}
		if (this.position.x <= 0) {
			this.position.x = 0;
		}


		this.position.y += this.velocity.y;

		if (this.position.y + this.parameters.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0;
		}
		else {
			this.velocity.y += gravity;
		}


	}
}

const player = new Sprite({
	position: {
		x: 400,
		y: 200,
	},
	velocity: {
		x: 0,
		y: 10,
	},
	parameters: {
		width: 50,
		height: 150,
		jumpHeight: 200
	},
	keys:{
		moveX: {
			a: {
				pressed: false
			},
			d: {
				pressed: false
			},
		},
		jump: {
			w: {
				pressed: false
			}
		}
	}
})

const enemy = new Sprite({
	position: {
		x: 0,
		y: 200,
	},
	velocity: {
		x: 0,
		y: 10,
	},
	parameters: {
		width: 50,
		height: 150,
		jumpHeight: 200
	},
	keys:{
		moveX: {

			ArrowLeft: {
				pressed: false
			},
			ArrowRight: {
				pressed: false
			},
		},
		jump: {
			ArrowUp: {
				pressed: false
			},
		}
	}
})

function animate() {
	window.requestAnimationFrame(animate);
	context.fillStyle = backgroundColor;
	context.fillRect(
		0,
		0,
		canvas.width,
		canvas.height
	);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	if (player.keys.moveX.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -2;
	}
	else if (player.keys.moveX.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 2;
	}

	if (enemy.keys.moveX.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -2;
	}
	else if (enemy.keys.moveX.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 2;
	}
}

// key binding
window.addEventListener('keydown', function (event) {
	if (Object.keys(player.keys.moveX).includes(event.key)) {
		player.keys.moveX[event.key].pressed = true;
		player.lastKey = event.key;
	}
	if (Object.keys(enemy.keys.moveX).includes(event.key)) {
		enemy.keys.moveX[event.key].pressed = true;
		enemy.lastKey = event.key;
	}

	if (event.key == 'w') {
		if (player.position.y + player.parameters.height >= canvas.height) {
			player.position.y = player.parameters.jumpHeight;
		}
	}
	if (event.key == 'ArrowUp') {
		if (enemy.position.y + enemy.parameters.height >= canvas.height) {
			enemy.position.y = enemy.parameters.jumpHeight;
		}
	}
});


window.addEventListener('keyup', function (event) {
	if (Object.keys(player.keys.moveX).includes(event.key)) {
		player.keys.moveX[event.key].pressed = false;
	}
	if (Object.keys(enemy.keys.moveX).includes(event.key)) {
		enemy.keys.moveX[event.key].pressed = false;
	}
});

animate();
