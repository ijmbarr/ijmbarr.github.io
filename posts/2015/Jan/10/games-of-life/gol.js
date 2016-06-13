var GameOfLife = function(canvasID, opts){

    //Initialise things
    this.canvasID = canvasID;
    this.opts = opts;
    this.state = [];
    this.that = this;

    //Grid
    if(opts.gridSize === "50"){
        this.width = 50;
        this.height = 50;
    }else if (opts.gridSize === "100"){
        this.width = 100;
        this.height = 100;
    }else if(opts.gridSize === "200"){
        this.width = 200;
        this.height = 200;
    }

    this.Grid = new grid(this.width, this.height, this.canvasID);

    //Deal with mouse events
    this.mouseDown = false;
    this.cursorPos = {x:undefined, y:undefined};
}

GameOfLife.prototype.bc = function(current, x, y){
    if(this.opts.boundary === "periodic"){
        if(y < 0){
            var tempY = this.height-1;
        }else if(y >= this.height){
            var tempY = 0;
        }else{
            var tempY = y;
        }

        if(x < 0){
            var tempX = this.width-1;
        }else if(x >= this.width){
            var tempX = 0;
        }else{
            var tempX = x;
        }
        return current[tempY][tempX];

    }else if(this.opts.boundary === "dead"){
        if(y < 0){
            return 0;
        }else if(y >= this.height){
            return 0;
        }else{
            var tempY = y;
        }

        if(x < 0){
            return 0;
        }else if(x >= this.width){
            return 0;
        }else{
            var tempX = x;
        }
        return current[tempY][tempX];
    }
}

//Update state
GameOfLife.prototype.applyRules = function(current, x, y){

    var count = 0;
    var xx, yy
    for(xx = -1; xx < 2; xx++){
        for(yy = -1; yy < 2; yy++){
            if(!(xx==0&&yy==0)){
                count += this.bc(current, xx + x, yy + y);
            }
        }
    }

    //Add Some Random
    if(this.opts.noise === "yes"){
        if (Math.random() >= (1.0 - 1.0/(this.width*this.height))){
            return 1;
        }
    }

    //Apply Rules
    if(current[y][x] == 1){
        if(this.opts.ruleSet.s.indexOf(count) > -1){
            return 1;
        } else {
            return 0;
        }
    } else {
        if(this.opts.ruleSet.b.indexOf(count) > -1){
            return 1;
        } else {
            return 0;
        }
    }
}



GameOfLife.prototype.tryToDraw = function(e, that){
    if(that.mouseDown){
        var offset = $("#" + that.canvasID).offset();
        var cx = that.Grid.getX(e.pageX - offset.left);
        var cy = that.Grid.getY(e.pageY - offset.top);

        if (!(that.cursorPos.x == cx && that.cursorPos.y == cy)){
            that.state[cy][cx] = (that.state[cy][cx] + 1)%2;
            that.Grid.drawSingleSquare(cx, cy, that.state[cy][cx]);

            that.cursorPos.x = cx;
            that.cursorPos.y = cy;
        }       
    }
}

GameOfLife.prototype.addMouseListeners = function(that){
    $("#" + that.canvasID).on("mouseout", function(e){that.mouseDown = false; that.cursorPos = {x:undefined, y:undefined}; });
    $("#" + that.canvasID).on("mousemove", function(e){that.tryToDraw(e, that); });
    $("#" + that.canvasID).on("mousedown", function(e){that.mouseDown = true; that.tryToDraw(e, that); });
    $("#" + that.canvasID).on("mouseup", function(e){that.mouseDown = false; that.cursorPos = {x:undefined, y:undefined}; });
}

GameOfLife.prototype.removeMouseListeners = function(){
    $("#" + this.canvasID).unbind("mouseout");
    $("#" + this.canvasID).unbind("mousemove");
    $("#" + this.canvasID).unbind("mousedown");
    $("#" + this.canvasID).unbind("mouseup");
}


GameOfLife.prototype.start = function(){
    var that = this;
    this.addMouseListeners(that);

    if(this.opts.initial === "random"){
        this.state = this.randomGrid();           
    } else if (this.opts.initial === "empty"){
        this.state = this.emptyGrid();
    }

    this.Grid.draw(this.state);
}

GameOfLife.prototype.next = function(){
    var newState = this.emptyGrid();
    for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
            newState[y][x] = this.applyRules(this.state, x, y);
        }
    }

    this.state = newState;
    this.Grid.draw(this.state);
}

    //Helper functions:
GameOfLife.prototype.randomGrid = function(){
    var toReturn = [];
    for(var y = 0; y < this.height; y++){
        var tempRow = []
        for(var x = 0; x < this.width; x++){
            tempRow.push(Math.round(Math.random()));
        }
        toReturn.push(tempRow);
    }
    return toReturn;
}

GameOfLife.prototype.emptyGrid = function(){
    var toReturn = [];
    for(var y = 0; y < this.height; y++){
        var tempRow = []
        for(var x = 0; x < this.width; x++){
            tempRow.push(0);
        }
        toReturn.push(tempRow);
    }
    return toReturn;
}

