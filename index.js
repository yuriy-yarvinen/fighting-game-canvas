
context.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './images/background.png'
})
const shopImage = new Sprite({
	position: {
		x: 600,
		y: 128
	},
	scale: 2.75,
	framesMax: 6,
	imageSrc: './images/shop.png'
})

const player = new Fighters({
	position: {
		x: 0,
		y: 200,
	},
	velocity: {
		x: 0,
		y: 10,
	},
	parameters: {
		speed: 4,
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
		stopFall: 97,
		lifeDivId: 'player-life'
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
	},
	scale: 2.75,
	offset: {
		x: 215,
		y: 180
	},
	framesMax: 8,
	imageSrc: './images/samuraiMack/Idle.png',
	sprites: {
		idle: {
			framesMax: 8,
			imageSrc: './images/samuraiMack/Idle.png'
		},
		run: {
			framesMax: 8,
			imageSrc: './images/samuraiMack/Run.png'
		},
		jump: {
			framesMax: 2,
			imageSrc: './images/samuraiMack/Jump.png'
		},
		fall: {
			framesMax: 2,
			imageSrc: './images/samuraiMack/Fall.png'
		},

	}
})

const enemy = new Fighters({
	position: {
		x: canvas.width - 50,
		y: 200,
	},
	velocity: {
		x: 0,
		y: 10,
	},
	parameters: {
		speed: 4,
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
		stopFall: 97,
		lifeDivId: 'enemy-life'

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
	},
	scale: 2.75,
	offset: {
		x: 215,
		y: 180
	},
	framesMax: 8,
	imageSrc: './images/samuraiMack/Idle.png',
	sprites: {
		idle: {
			framesMax: 8,
			imageSrc: './images/samuraiMack/Idle.png'
		},
		run: {
			framesMax: 8,
			imageSrc: './images/samuraiMack/Run.png'
		},
		jump: {
			framesMax: 2,
			imageSrc: './images/samuraiMack/Jump.png'
		},
		fall: {
			framesMax: 2,
			imageSrc: './images/samuraiMack/Fall.png'
		},

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
	background.update();
	shopImage.update();
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	if (player.keys.moveX.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -player.parameters.speed;
		player.switchSprites('run');

	}
	else if (player.keys.moveX.d.pressed && player.lastKey === 'd') {
		player.velocity.x = player.parameters.speed;
		player.switchSprites('run');

	}
	else{
		player.switchSprites('idle');
		
	}
	if(player.velocity.y < 0){
		player.switchSprites('jump');
		
	}
	else if(player.velocity.y > 0){
		player.switchSprites('fall');

	}

	if (enemy.keys.moveX.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -enemy.parameters.speed;
		enemy.switchSprites('run');

	}
	else if (enemy.keys.moveX.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = enemy.parameters.speed;
		enemy.switchSprites('run');

	}
	else{
		enemy.switchSprites('idle');

	}

	if(enemy.velocity.y < 0){
		enemy.switchSprites('jump');
		
	}
	else if(enemy.velocity.y > 0){
		enemy.switchSprites('fall');

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
		if (enemy.parameters.hp > 0) {
			enemy.parameters.hp = enemy.parameters.hp - player.parameters.attackPower;
		}
		else {
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
		if (player.parameters.hp > 0) {
			player.parameters.hp = player.parameters.hp - enemy.parameters.attackPower;
		}
		else {
			player.parameters.hp = 0
		}

		player.lifeBlock.style.width = player.parameters.hp + '%';

	}

	if (enemy.parameters.hp <= 0 || player.parameters.hp <= 0) {
		stopGame()
	}
}

// key binding
window.addEventListener('keydown', function (event) {
	if (Object.keys(player.keys.moveX).includes(event.key)) {
		player.keys.moveX[event.key].pressed = true;
		player.lastKey = event.key;
	}

	if (event.key == 'w') {
		if (player.position.y + player.parameters.height >= canvas.height - player.parameters.stopFall) {
			player.velocity.y = player.parameters.jumpHeight;

		}
	}

	if (player.keys.attack.includes(event.key)) {
		player.attack();
	}

	if (Object.keys(enemy.keys.moveX).includes(event.key)) {
		enemy.keys.moveX[event.key].pressed = true;
		enemy.lastKey = event.key;
	}
	if (event.key == 'ArrowUp') {
		if (enemy.position.y + enemy.parameters.height >= canvas.height - enemy.parameters.stopFall) {
			enemy.velocity.y = enemy.parameters.jumpHeight;
		}
	}

	if (enemy.keys.attack.includes(event.key)) {
		enemy.attack()
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
startGame();

var gameInterval = setInterval(() => {
	if (gameStarted) {
		timerTime--;

		if (timerTime <= 0) {
			timerTime = 0;
			stopGame()
		}
		timerBlock.innerHTML = timerTime;
	}

}, 1000);
console.log(player);