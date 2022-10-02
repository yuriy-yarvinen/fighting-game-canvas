const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const gravity = 0.7;
const backgroundColor = 'black';
const timerBlock = document.getElementById('timer');
const notificationBlock = document.getElementById('notification');
let timerTime = 100;
let gameStarted = false;
canvas.width = 1024;
canvas.height = 576;