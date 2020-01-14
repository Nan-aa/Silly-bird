function Pipe(img1,img2,x,y,speed){
	this.img1 = img1;
	this.img2 = img2;
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.h = Math.round(Math.random()*190)+30;
}