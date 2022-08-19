const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const gravity = 0.2;
const userColor = 'red';
const backgroundColor = 'black';

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.height = 150;
		this.width = 50;
	}

	draw() {
		context.fillStyle = userColor;
		context.fillRect(
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		
		if(this.position.x + this.width + this.velocity.x >= canvas.width){
			this.position.x = canvas.width - this.width;
		}


		this.position.y += this.velocity.y;
		
		if(this.position.y + this.height + this.velocity.y >= canvas.height){
			this.velocity.y = 0;
		}
		else{
			this.velocity.y += gravity;
		}
	}
}

const player = new Sprite({
	position:{
		x:400,
		y:200,
	},
	velocity:{
		x:0,
		y:10,
	},
})

const enemy = new Sprite({
	position:{
		x:0,
		y:200,
	},
	velocity:{
		x:0,
		y:10,
	},
})

function animate(){
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
}

animate();

// key binding

window.addEventListener('keydown', function(event){
	if(event.key == 'd'){
		player.velocity.x = 2;
	}
	if(event.key == 'a'){
		player.velocity.x = -2;
	}
});
window.addEventListener('keyup', function(event){
	if(event.key == 'd'){
		player.velocity.x = 0;
	}
	if(event.key == 'a'){
		player.velocity.x = 0;
	}
});