class Sprite {
	constructor({ position, scale = 1, imageSrc, framesMax = 1, framesCurrent = 0, offset = {x:0, y:0} }) {
		this.position = position;
		this.scale = scale;
		this.image = new Image();
		this.image.src = imageSrc;
		this.framesMax = framesMax;
		this.framesCurrent = framesCurrent;
		this.framesElapced = 0;
		this.framesHold = 5;
		this.offset = offset;
	}

	draw() {
		context.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			(this.image.width / this.framesMax),
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);
	}

	updateFrames() {
		this.framesElapced++;
		if (this.framesElapced % this.framesHold === 0) {

			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++
			}
			else {
				this.framesCurrent = 0;
			}
		}
	}

	update() {
		this.draw();
		this.updateFrames();
	}

}

class Fighters extends Sprite {
	constructor({
		position,
		velocity,
		parameters,
		keys,
		lastKey,
		sprites,
		scale = 1,
		imageSrc,
		framesMax = 1,
		framesCurrent = 0,
		offset
	}) {
		super({
			position,
			scale,
			imageSrc,
			framesMax,
			offset,
		}),
		
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
		this.lifeBlock = document.getElementById(this.parameters.lifeDivId).querySelector('.hp');

		this.sprites = sprites;
		for (const sprite in this.sprites) {
			this.sprites[sprite].image = new Image();
			this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
		}
	}

	// draw() {
	// 	if (this.isAttacking) {
	// 		context.fillStyle = this.parameters.attackColor;

	// 		context.fillRect(
	// 			this.attackBox.position.x,
	// 			this.attackBox.position.y,
	// 			this.attackBox.width,
	// 			this.attackBox.height
	// 		)
	// 	}
	// }

	switchSprites(spriteName) {
		if (this.sprites[spriteName]) {
			if (this.image != this.sprites[spriteName].image) {
				this.image = this.sprites[spriteName].image;
				this.framesMax = this.sprites[spriteName].framesMax;
				this.framesCurrent = 0;
			}
		}
	}

	update() {
		this.draw();
		this.updateFrames();
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

		if (this.position.y + this.parameters.height + this.velocity.y >= canvas.height - this.parameters.stopFall) {
			this.velocity.y = 0;
			this.position.y = 330; /// set from min object position y on screen https://i.imgur.com/nGCudk1.png
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