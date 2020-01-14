function Game(land, bird, bg, pipe, ctx){
	this.bird = bird;
	this.bg = bg;
	this.land = land;
	this.pipes = [pipe];
	this.ctx = ctx;
	this.idx = 0;
	this.timer = null;
	this.init();
}
Game.prototype.init = function(){
	//开始游戏
	this.bindEvent();
	var that = this;

	that.timer = setInterval(function(){
		that.ctx.clearRect(0, 0, that.ctx.canvas.width, that.ctx.canvas.height);
		if (that.check()) {
			clearInterval(that.timer);
			that.gameOver();
			return;
		}
		that.renderBg();
		that.renderLand();
		that.renderPipe();
		that.renderBird();
		that.fly();
	},30)
}
Game.prototype.renderBg = function(){
	this.ctx.drawImage(this.bg.img,this.bg.x,this.bg.y);
	this.ctx.drawImage(this.bg.img, this.bg.x + this.bg.img.width, this.bg.y);
    this.ctx.drawImage(this.bg.img, this.bg.x + this.bg.img.width * 2, this.bg.y);
	this.bg.x -= this.bg.speed;
	if (this.bg.x <= -this.bg.img.width) {
        this.bg.x = 0;
    }
}
Game.prototype.renderLand = function(){
	this.ctx.drawImage(this.land.img,this.land.x,this.land.y);
	this.ctx.drawImage(this.land.img, this.land.x + this.land.img.width, this.land.y);
    this.ctx.drawImage(this.land.img, this.land.x + this.land.img.width * 2, this.land.y);
	this.land.x -= this.land.speed;
	if (this.land.x <= -this.land.img.width) {
        this.land.x = 0;
    }
}
Game.prototype.renderPipe = function(){
	var that = this;
	this.pipes.forEach(function(value){
		that.ctx.drawImage(value.img1,0,320-value.h,value.img1.width,value.h,value.x,value.y,value.img1.width,value.h);
		that.ctx.drawImage(value.img2, 0, 0, value.img2.width, 280-value.h, value.x, value.y+value.h+120,value.img2.width,280-value.h);
		value.x -= value.speed;
	});
	// console.log(this.pipes[0].x,this.pipes);
	if (this.pipes[0].x == 120) { //要是你减少的速度的倍数，要不获取不到
		this.pipes.push(new Pipe(imgs[0],imgs[1],360,0,3));
	}else if(this.pipes[0].x < -this.pipes[0].img1.width){
		this.pipes.shift();
	}

}
Game.prototype.renderBird = function(){
	this.ctx.save();
	this.ctx.translate(this.bird.x,this.bird.y);
	var deg = this.bird.direction == 'D'? Math.PI/180 * this.bird.speed * 3 : -Math.PI/180 * this.bird.speed * 4;
	this.ctx.rotate(deg);
	this.idx++;
	this.ctx.drawImage(this.bird.imgs[this.idx % 3],-25,-25);
	this.ctx.restore();
	
}
Game.prototype.fly = function(){
	if (this.bird.direction == 'D') {
		this.bird.y += this.bird.speed;
		this.bird.speed += 0.3;
	}else{
		this.bird.y -= this.bird.speed;
		this.bird.speed -= 0.3;
		if (this.bird.speed <= 0) {
			this.bird.direction = 'D';
		}
	}

}
Game.prototype.bindEvent = function(){
	var that = this;
	document.onclick = function(){
		that.bird.direction = 'U';
		that.bird.speed = 5;
	}
}

//检测碰撞
Game.prototype.check = function(){
	if (this.bird.y <= 0 || this.bird.y >= 450 - this.bird.imgs[0].height) {
		return true;
	};
	this.ctx.save();
	this.renderPipe();
	this.ctx.globalCompositeOperation = 'source-in';
	this.renderBird();
	this.ctx.restore();
	var res = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (var i = 0; i < res.data.length; i++) {
        if (res.data[i]) {
            return true;
        }
    }
}
Game.prototype.gameOver = function(){
	this.ctx.clearRect(0,0,360,512);
	var img = new Image();
	img.src = 'images/timg.jpg';
	var that = this;
	img.onload = function(){
		that.ctx.drawImage(img,0,0,360,512);
	}
}