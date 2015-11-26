(function(window, document, undefined) {
    var selectedSign;
    var mySign;
    var yourSign;
    var myIndex;
    var gameObject = {};
    var count = 0;
    var lengthObect = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    function Cube(cubeId) {
        this.Cube = document.querySelector(cubeId);
        this.winProbability = [
            [1, 2, 3],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
            [3, 5, 7],
            [1, 5, 9]
        ];

    }

    Cube.prototype.addEventListener = function() {
        this.Cube.addEventListener('click', this.playGame.bind(this));
        var self = this;

        // for x
        document.querySelectorAll(".chooser")[0].addEventListener("click", function(e) {
            if (mySign === undefined) {
                var selectedSign_ = this.querySelector("input").id;
                this.querySelector("input").checked = true;
                mySign = selectedSign_;
                mySign = "o";
                yourSign = "x";
                selectedSign = selectedSign_;
            }
        });

        // for y
        document.querySelectorAll(".chooser")[1].addEventListener("click", function(e) {
            if (mySign === undefined) {
                var selectedSign_ = this.querySelector("input").id;
                this.querySelector("input").checked = true;
                mySign = "x";
                yourSign = "o";
                selectedSign = selectedSign_;
            }
        });
    }

    Cube.prototype.playGame = function(e) {
        // BASIC REQUIREMENT
        var clickedCube = e.target;
        var cubeIndex = this.getChildrenIndex(clickedCube);

        if (selectedSign) {
            if (!clickedCube.innerText)
                this.changeElementSign(clickedCube, cubeIndex);
            else
                alert("This place is taken");
        } else
            alert("Please Choose your Sign!!!");
    }

    Cube.prototype.changeElementSign = function(clickedCube, cubeIndex) {
        if (mySign === selectedSign) {
            alert("computer turn");
        } else {
            clickedCube.innerText = selectedSign;
            document.querySelector("#" + mySign).checked = true;
            gameObject[cubeIndex + 1] = selectedSign;

            // console.log(selectedSign);
            selectedSign = mySign;
            lengthObect.splice(cubeIndex, 1);

            this.calculateWinProb();
            this.myTurn(cubeIndex);
        }
    }

    Cube.prototype.myTurn = function() {
        var self = this;
        if (Object.keys(gameObject).length !== 0) {
            Turn("My Turn");
            setTimeout(function() {
                if (myIndex) {
                    console.log(myIndex);
                    document.querySelectorAll("ul li")[myIndex - 1].innerText = mySign;
                    gameObject[myIndex] = mySign;
                    document.querySelector("#" + yourSign).checked = true;
                    selectedSign = yourSign;
                    myIndex = undefined;
                    self.calculateWinProb();
                    if (Object.keys(gameObject).length !== 0) {
                        Turn("Your Turn");
                    }
                }
            }, 5000);
        }
    }

    function Turn(mssg) {
        document.querySelector(".highlights").innerHTML = mssg;
        document.querySelector(".highlights").style.opacity = 1;
        document.querySelector(".highlights").style.left = "0px";
        setTimeout(function() {
            document.querySelector(".highlights").style.left = "-300px";
            document.querySelector(".highlights").style.opacity = 0;
        }, 2000);
    }

    function maxinObject(arr) {
        var max = arr[0];
        var maxIndex = 0;

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }
        return max;
    }

    Cube.prototype.calculateWinProb = function() {
        // console.log(gameObject);

        // CHECK OPERATION
        var self = this;
        this.winProbability.forEach(function(elements) {
            var arr = [];
            var pos = [];
            var dangerIndex = [];
            var myMoves = [];
            elements.forEach(function(element) {
                if (gameObject[element]) {
                    arr.push(gameObject[element]);
                    pos.push(element);
                    dangerIndex = elements;
                } else {
                    if (!document.querySelectorAll("ul li")[element - 1].innerHTML) {
                        if (myIndex === undefined) {
                            myIndex = element;
                        }
                        myMoves = elements;
                    }
                }
            });
            var xsignal = false,
                osignal = false;

            // if (arr, yourSign)
            if (mySign === selectedSign) {
                var flag = false;
                if (arr.length > 1)
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] !== yourSign) {
                            flag = false;
                            break;
                        } else {
                            flag = true;
                        }
                    }
                if (flag) {
                    var myIndex_;
                    dangerIndex.forEach(function(index, i) {
                        if (pos.indexOf(index) === -1 && !document.querySelectorAll("ul li")[index - 1].innerHTML)
                            myIndex_ = index;
                    });
                    if (myIndex_) {
                        myIndex = myIndex_
                    }
                }
                //  else {
                //     var myflag = false;
                //     if (myMoves.length === 3) {
                //         for (var i = 0; i < myMoves.length; i++) {
                //             if (!myflag) {
                //                 debugger;
                //                 var currentElement = document.querySelectorAll("ul li")[myMoves[i] - 1];
                //                 if (currentElement.innerHTML !== mySign && currentElement.innerHTML !== "") {
                //                     break;
                //                 } else {
                //                     myIndex = myMoves[i];
                //                     myflag = true;
                //                 }
                //             } else
                //                 break;
                //         }
                //         console.log(myMoves, mySign, dangerIndex, myIndex);
                //     }
                // }
            }

            if (arr.length === 3) {
                // console.log(arr);
                // console.log(pos);
                if (arr[0] === 'x' && arr[1] === 'x' && arr[2] === 'x') {
                    xsignal = true;
                }
                if (arr[0] === 'o' && arr[1] === 'o' && arr[2] === 'o') {
                    osignal = true;
                }
            }
            if (xsignal === true) {
                console.log("xsignal won");
                pos.forEach(function(element) {
                    document.querySelector('#page ul').children[element - 1].style.background = "red";
                })
                document.querySelector('#message').innerHTML = "Hurray X Player Won!!! Wanna Play Again Click";
                document.querySelector('#message').style.background = "red";
                document.querySelector('#message').style.opacity = "1";
                gameObject = {};
            } else if (osignal === true) {
                console.log("osignal won");
                pos.forEach(function(element) {
                    document.querySelector('#page ul').children[element - 1].style.background = "blue";
                })
                document.querySelector('#message').innerHTML = "Hurray O Player Won!!! Wanna Play Again Click";
                document.querySelector('#message').style.background = "blue";
                document.querySelector('#message').style.opacity = "1";
                gameObject = {};
            }

        })
    }

    Cube.prototype.getChildrenIndex = function(node) {
        var childs = this.Cube.children,
            cubeIndex;

        for (var i = 0; i < childs.length; i++) {
            if (node == childs[i]) {
                cubeIndex = i;
                count++;
            }
        }

        return cubeIndex;
    }


    // START GAME BY PROVIDING WRAPPER ID
    var cube = new Cube("#page ul");
    cube.addEventListener();
})(window, document, undefined)
