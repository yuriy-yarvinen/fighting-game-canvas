
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
		width: 100,
		height: 150,
		jumpHeight: -20,
		attackWidth: 200,
		attackHeight: 180,
		attackFrame: 4,
		attackOffset: {
			x: 100,
			y: -30
		},
		hp: 100,
		attackPower: 10,
		stopFall: 97,
		lifeDivId: 'player-life'
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
		attack1: {
			framesMax: 6,
			imageSrc: './images/samuraiMack/Attack1.png'
		},
		attack2: {
			framesMax: 6,
			imageSrc: './images/samuraiMack/Attack2.png'
		},
		takeHit: {
			framesMax: 4,
			imageSrc: './images/samuraiMack/Take Hit - white silhouette.png'
		},
		death: {
			framesMax: 6,
			imageSrc: './images/samuraiMack/Death.png'
		},
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
		width: 100,
		height: 150,
		jumpHeight: -20,
		attackWidth: 180,
		attackHeight: 150,
		attackFrame: 2,
		attackOffset: {
			x: -180,
			y: -5
		},
		hp: 100,
		attackPower: 10,
		stopFall: 97,
		lifeDivId: 'enemy-life'

	},

	scale: 2.75,
	offset: {
		x: 240,
		y: 198
	},
	framesMax: 4,
	imageSrc: './images/kenji/Idle.png',
	sprites: {
		idle: {
			framesMax: 4,
			imageSrc: './images/kenji/Idle.png'
		},
		run: {
			framesMax: 8,
			imageSrc: './images/kenji/Run.png'
		},
		jump: {
			framesMax: 2,
			imageSrc: './images/kenji/Jump.png'
		},
		fall: {
			framesMax: 2,
			imageSrc: './images/kenji/Fall.png'
		},
		attack1: {
			framesMax: 4,
			imageSrc: './images/kenji/Attack1.png'
		},
		attack2: {
			framesMax: 4,
			imageSrc: './images/kenji/Attack2.png'
		},
		takeHit: {
			framesMax: 3,
			imageSrc: './images/kenji/Take hit.png'
		},
		death: {
			framesMax: 7,
			imageSrc: './images/kenji/Death.png'
		},
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
	else {
		player.switchSprites('idle');

	}
	if (player.velocity.y < 0) {
		player.switchSprites('jump');

	}
	else if (player.velocity.y > 0) {
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
	else {
		enemy.switchSprites('idle');

	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprites('jump');

	}
	else if (enemy.velocity.y > 0) {
		enemy.switchSprites('fall');

	}
	/// attack detect
	attackDetect(player, enemy)
	attackDetect(enemy, player)


	if (enemy.parameters.hp <= 0 || player.parameters.hp <= 0) {
		stopGame()
	}
}

function attackDetect(object1, object2) {
	if (
		rectangularCollision(
			{
				rectangle1: object1,
				rectangle2: object2
			}
		) &&
		object1.isAttacking &&
		object1.framesCurrent === object1.parameters.attackFrame
	) {
		object1.isAttacking = false;
		object2.parameters.hp = object2.parameters.hp - object1.parameters.attackPower;		
		
		gsap.to(object2.lifeBlock, {
			width: object2.parameters.hp + '%'
		});

		if (object2.parameters.hp <= 0) {
			object2.parameters.hp = 0;
		}

		if(!object1.dead){
			if (object2.parameters.hp > 0) {
				object2.switchSprites('takeHit');
			} else {
				object2.switchSprites('death');
			}
		}


	}

	if (object1.framesCurrent === object1.parameters.attackFrame) {
		object1.isAttacking = false;
	}
}

// key binding
window.addEventListener('keydown', function (event) {
	if (!player.dead) {
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
			player.attack1();
		}
	}

	if (!enemy.dead) {
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
			enemy.attack1()
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