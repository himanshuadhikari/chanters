(function(window, document, undefined) {
    function Snake(snake) {
        this.snake = snake;
        if (!this.snake.parentNode)
            this.snake.parentNode = this.snake[0].parentNode;
        Food.call(this, food);
    }
    Snake.prototype = Object.create(Food.prototype);
    Snake.prototype.constructor = Snake;

    Snake.prototype.changeSnakePosition = function(event) {
        var self = this;
        if (this.interval)
            clearInterval(this.interval);

        if (!this.gameLost)
            this.interval = setInterval(function() {
                if (event) {
                    self.eatFood();
                    if (event.keyCode === 38)
                        self.goUp('up');

                    else if (event.keyCode === 40)
                        self.goDown('down');

                    else if (event.keyCode === 39)
                        self.goRight('up');

                    else if (event.keyCode === 37)
                        self.goLeft('down');
                }
            }, 200);
    }



    Snake.prototype.goRight = function() {
        // console.log("goint right");  

        if (this.snake && this.snake.length) {
            var parent;
            for (var i = 0; i < this.snake.length; i++)
                if (this.snake[i].offsetTop > 0) {
                    if (!parent) {
                        parent = this.snake[0];
                    } else {
                        parent = this.snake[i - 1];
                    }
                    this.snake[i].style.left = (parent.offsetLeft + 15).toString() + "px";
                    // this.snake[i].style.left = (this.snake[i].offsetLeft + 15).toString() + "px";
                    this.snake[i].previousPosition = arguments.callee;
                    if ((window.innerWidth - this.snake[0].offsetLeft) < 0)
                        this.youlost();
                } else
                    this.youlost();
        }
    }

    Snake.prototype.goLeft = function() {
        // console.log("goint left");
        if (this.snake && this.snake.length) {
            var parent;
            for (var i = 0; i < this.snake.length; i++) {
                if (this.snake[i].offsetLeft > 0) {
                    if (!parent) {
                        parent = this.snake[0];
                    } else {
                        parent = this.snake[i - 1];
                    }
                    this.snake[i].style.left = (parent.offsetLeft - 15).toString() + "px";
                    this.snake[i].previousPosition = arguments.callee;
                    if (this.snake[0].offsetLeft < 0)
                        this.youlost();
                } else
                    this.youlost();
            }
        }
        // if (this.snake.length === 2)
            // debugger;
    }

    Snake.prototype.goDown = function() {
        // console.log("goint down");
        if (this.snake && this.snake.length) {
            var parent;
            for (var i = 0; i < this.snake.length; i++)
                if (this.snake[i].offsetTop > 0) {
                    if (!parent) {
                        parent = this.snake[0];

                    } else {
                        parent = this.snake[i - 1];
                    }
                    if (!this.coordinates) {
                        debugger;
                        this.coordinates = {
                            "top": this.snake[0].offsetTop,
                            "left": this.snake[0].offsetLeft
                        }
                        this.snake[i].style.top = (parent.offsetTop + 15) + "px";

                        this.snake[i+1].style.top=this.snake[i+1].offsetTop+15+"px";
                    }else{
                        this.snake[i].style.top = (parent.offsetTop + 15) + "px";
                    }

                    
                    console.log(this.coordinates);
                    
                    // this.snake[i].style.top = (this.snake[i].offsetTop + 15).toString() + "px";
                    this.snake[i].previousPosition = arguments.callee;
                    if ((window.innerHeight - this.snake[0].offsetTop) < 0)
                        this.youlost();
                } else
                    this.youlost();
        }
    }

    Snake.prototype.goUp = function() {
        // console.log("goint up");
        if (this.snake && this.snake.length)
            for (var i = 0; i < this.snake.length; i++)
                if (this.snake[i].offsetTop > 0) {
                    this.snake[i].style.top = (this.snake[i].offsetTop - 15).toString() + "px";
                    this.snake[i].previousPosition = arguments.callee;
                    if (this.snake[0].offsetTop < 0)
                        this.youlost();
                } else
                    this.youlost();
    }

    Snake.prototype.growSize = function() {
        var replicateSize = document.createElement("li");
        replicateSize.classList.add("snake");
        this.snake.parentNode.appendChild(replicateSize);
        this.snake = document.querySelectorAll(".snake");
        if (!this.snake.parentNode)
            this.snake.parentNode = this.snake[0].parentNode;
    }



    function Food(food) {
        this.food = food;
    }

    Food.prototype.changeFoodPosition = function(min, max) {
        var left = getRandomArbitrary(0, window.innerWidth);
        var top = getRandomArbitrary(0, window.innerHeight);
        this.food.style.left = left.toString() + +"px";
        if (top % 15 === 0)
            this.food.style.top = top + "px";
        else
            this.food.style.top = (top + Math.ceil(top / 15)) + "px";
    }

    Food.prototype.eatFood = function() {
        if (this.snake[0].offsetTop === this.food.offsetTop && (this.snake[0].offsetLeft - this.food.offsetLeft < 15 && this.snake[0].offsetLeft - this.food.offsetLeft > 0)) {
            // console.log("snake", this.snake.offsetTop, this.snake.offsetLeft);
            // console.log("food", this.food.offsetTop, this.food.offsetLeft);
            this.growSize();
            // this.snake.style.width = this.snake.offsetWidth + 15 + "px";
            // this.changeFoodPosition();
        }

    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }


    function Game(food, snake, wall) {
        this.gameLost = false;
        Snake.call(this, snake, food);
    }

    Game.prototype = Object.create(Snake.prototype);
    Game.prototype.constructor = Game;
    Game.prototype.youlost = function() {
        alert("youlost");
        this.gameLost = true;
        clearInterval(this.interval);
    };


    window.onload = function() {
        var snake = document.querySelectorAll(".snake");
        var food = document.querySelector("#food");
        var wall = document.querySelector(".wall");
        var game = new Game(food, snake, wall);
        // console.log("sdf", game);

        document.addEventListener("keydown", keyEvent);

        function keyEvent(event) {
            // game.changeFoodPosition;

            game.changeSnakePosition(event);
            // setInterval(function() {
            //     game.changeSnakePosition(event);
            // }, 2000);
            // console.log(event.keyCode, game);
        }
    }

})(window, document, undefined);
