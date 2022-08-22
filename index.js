const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const gravity = 0.7;
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
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			width: this.parameters.attackWidth,
			height: this.parameters.attackHeight,
			offset: this.parameters.attackOffset,

		};
		this.isAttacking;
		this.lifeBlock = document.getElementById(this.parameters.lifeDivId).querySelector('.hp')
	}

	draw() {
		context.fillStyle = this.parameters.userColor;
		context.fillRect(
			this.position.x,
			this.position.y,
			this.parameters.width,
			this.parameters.height
		)

		if (this.isAttacking) {
			context.fillStyle = this.parameters.attackColor;

			context.fillRect(
				this.attackBox.position.x,
				this.attackBox.position.y,
				this.attackBox.width,
				this.attackBox.height
			)
		}
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.attackBox.position.x = this.position.x + this.attackBox.offset;
		this.attackBox.position.y = this.position.y;

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

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}

function rectangularCollision({ rectangle1, rectangle2 }) {
	return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.parameters.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.parameters.height);
}

const player = new Sprite({
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
		jumpHeight: -20,
		attackWidth: 100,
		attackHeight: 50,
		userColor: 'green',
		attackColor: 'red',
		attackOffset: 0,
		hp: 100,
		attackPower: 10,
		lifeDivId:'player-life' 
	},
	keys: {
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
		},
		attack: [' ']
	}
})

const enemy = new Sprite({
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
		jumpHeight: -20,
		attackWidth: 100,
		attackHeight: 50,
		userColor: 'blue',
		attackColor: 'red',
		attackOffset: -50,
		hp: 100,
		attackPower: 10,
		lifeDivId:'enemy-life' 

	},
	keys: {
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
		},
		attack: ['ArrowDown']
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

	/// attack detect
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) &&
		player.isAttacking
	) {
		player.isAttacking = false;
		if(enemy.parameters.hp > 0){
			enemy.parameters.hp = enemy.parameters.hp - player.parameters.attackPower;
		}
		else{
			enemy.parameters.hp = 0
		}
		enemy.lifeBlock.style.width = enemy.parameters.hp + '%';
	}
	if (
		rectangularCollision(
			{
				rectangle1: enemy,
				rectangle2: player
			}
		) &&
		enemy.isAttacking
	) {
		enemy.isAttacking = false;
		if(player.parameters.hp > 0){
			player.parameters.hp = player.parameters.hp - enemy.parameters.attackPower;
		}
		else{
			player.parameters.hp = 0
		}
		player.lifeBlock.style.width =  player.parameters.hp + '%';


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
	if (player.keys.attack.includes(event.key)) {
		player.attack();
	}
	if (enemy.keys.attack.includes(event.key)) {
		enemy.attack()
	}

	if (event.key == 'w') {
		if (player.position.y + player.parameters.height >= canvas.height) {
			player.velocity.y = player.parameters.jumpHeight;

		}
	}
	if (event.key == 'ArrowUp') {

		if (enemy.position.y + enemy.parameters.height >= canvas.height) {
			enemy.velocity.y = enemy.parameters.jumpHeight;

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
