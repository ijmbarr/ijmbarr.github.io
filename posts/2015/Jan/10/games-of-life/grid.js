var grid = function(width, height, canvasID){
    this.canvasID = canvasID;
    this.canvas = document.getElementById(canvasID);
    this.canvasContext = this.canvas.getContext("2d");

    this.width = width;
    this.height = height;

    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.dx = this.canvasWidth/this.width;
    this.dy = this.canvasHeight/this.height;

    this.colorMap = {1:"#262626", 0:"#EBEBEB"};
}

grid.prototype.drawGridRect = function(){
    //Draw Grid:
    this.canvasContext.beginPath();
    this.canvasContext.lineStyle = this.colorMap[1]
    this.canvasContext.strokeStyle = this.colorMap[1];

    for(var x = 1; x < this.width; x++){
        this.canvasContext.moveTo(x*this.dx, 0);
        this.canvasContext.lineTo(x*this.dx, this.canvasHeight);
    }

    for(var y = 1; y < this.height; y++){
        this.canvasContext.moveTo(0, y*this.dy);
        this.canvasContext.lineTo(this.canvasWidth, y*this.dy);
    }

    this.canvasContext.closePath();
}

grid.prototype.fillGridRect = function(gridArray){
    this.canvasContext.beginPath();
    this.canvasContext.fillStyle = this.colorMap[1];
    for(var x=0; x < this.width; x++){
        for(var y=0;y < this.height; y++){
            if(gridArray[y][x] == 1){
                this.canvasContext.rect(x*this.dx, y*this.dy, this.dx, this.dy);
            }
        }
    }
    this.canvasContext.closePath();
}

grid.prototype.draw = function(gridArray){
    //Clear Canvas
    this.canvasContext.fillStyle = this.colorMap[0];
    this.canvasContext.fillRect(0,0,this.canvasWidth, this.canvasHeight);

    this.fillGridRect(gridArray);
    this.canvasContext.fill();

    this.drawGridRect();
    this.canvasContext.stroke();
}

grid.prototype.drawSingleSquare = function(x,y,z){
    this.canvasContext.beginPath();
    this.canvasContext.fillStyle = this.colorMap[z];
    this.canvasContext.strokeStyle = this.colorMap[1];
    this.canvasContext.rect(x*this.dx, y*this.dy, this.dx, this.dy);
    this.canvasContext.fill();
    this.canvasContext.stroke();
}

grid.prototype.getX = function(x){
    return  Math.floor(x/this.dx);
}

grid.prototype.getY = function(y){
    return  Math.floor(y/this.dy);
}
