window.onload = function() {
    var sign = true;
    var gameObject = {};
    var count = 0;
    var cube = document.querySelector('#page ul');
    var winProbability = [
        [1, 2, 3],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9],
        [3, 5, 7],
        [1, 5, 9]
    ];


    var playGame = function(e) {

        // BASIC REQUIREMENT
        var cube = e.target;
        if (!cube.innerHTML && cube.tagName === 'LI') {
            var childs = cube.parentNode.children;
            var cubeIndex;

            // GET CHILDREN

            for (var i = 0; i < childs.length; i++) {
                if (cube == childs[i]) {
                    cubeIndex = i;
                    count++;
                }
            }

            // CHANGE DOM and UPDATE GAMEOBJECT

            if (sign) {
                cube.innerHTML = 'X';
                gameObject[cubeIndex + 1] = 'X';
                sign = false;
            } else {
                cube.innerHTML = 'O';
                gameObject[cubeIndex + 1] = 'O';
                sign = true;
            }

            if (count > 4) {

                // console.log(gameObject);

                // console.log(winProbability);
                // CHECK OPERATION
                winProbability.forEach(function(element) {
                    var arr = [];
                    var pos = [];
                    element.forEach(function(element) {
                        if (gameObject[element]) {
                            arr.push(gameObject[element]);
                            pos.push(element);
                        }
                    });
                    var xsignal = false,
                        osignal = false;
                    if (arr.length === 3) {
                        // console.log(arr);
                        // console.log(pos);
                        if (arr[0] === 'X' && arr[1] === 'X' && arr[2] === 'X') {
                            xsignal = true;
                        }
                        if (arr[0] === 'O' && arr[1] === 'O' && arr[2] === 'O') {
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
        }
    }
    cube.addEventListener('click', playGame);

    var message = document.querySelector('#message');
    var playAgain = function() {
        this.style.opacity = "0";
        var a = document.querySelectorAll('li');
        for (var i = 0; i < a.length; i++) {
            a[i].innerHTML = "";
            a[i].style.background = "none";
        }
    }
    message.addEventListener('click', playAgain)
}
