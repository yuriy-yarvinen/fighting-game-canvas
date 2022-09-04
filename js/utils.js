

function startGame() {
	gameStarted = true;
}

function stopGame() {
	let notification;
	if(timerTime <= 0){
		notification = 'Game over';
	} 
	if(player.parameters.hp === enemy.parameters.hp){
		notification = 'Tie';
	}
	if(player.parameters.hp > enemy.parameters.hp){
		notification = 'Player win';
	}
	if(player.parameters.hp < enemy.parameters.hp){
		notification = 'Enemy win';
	}

	clearInterval(gameInterval);
	notificationBlock.innerHTML = notification;
}



function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.parameters.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.parameters.height
	);
}
