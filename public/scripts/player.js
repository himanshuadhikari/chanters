var audioplayer, current = 0,
    tracks;
// play = document.querySelector('#play'),
// pause = document.querySelector('#pause'),
// previous = document.querySelector('#previous'),
// next = document.querySelector('#next');


var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

// var play = function(event) {
// var playMe = function(event) {
//     audio.src = "http://localhost:4444/home/himanshu/Videos/01._Alfaaz_ft_Honey_Singh_-_Haye_Mera_Dil_-_www.djsbuzz.blogspot.Com.mp3";
//     audio.load();
//     audio.play();
//     // document.querySelector(this).replaceWith('<div class="icon" id="pause"></div>');
//     visualizer();

// }

// var pause = function(e) {
//     e.preventDefault();
//     audio.pause();
//     // $(this).replaceWith('<div class="icon" id="play"></div>');

// }







// var visualizer = function() {
//     context = new AudioContext();
//     analyser = context.createAnalyser();
//     canvas = document.getElementById('analyser');
//     ctx = canvas.getContext('2d');
//     source = context.createMediaElementSource(audio);
//     source.connect(analyser);
//     analyser.connect(context.destination);
//     frameLooper();
// }

// function frameLooper() {
//     window.requestAnimationFrame(frameLooper);
//     fbc_array = new Uint8Array(analyser.frequencyBinCount);
//     analyser.getByteFrequencyData(fbc_array);


//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);


//     // light blue
//     grd.addColorStop(0, '#E20604');
//     // dark blue
//     grd.addColorStop(.20, '#FDF629');
//     grd.addColorStop(.40, '#4AF14E');
//     grd.addColorStop(.60, '#08D8EC');
//     grd.addColorStop(.80, '#3231F0');
//     grd.addColorStop(1, '#9426A3');
//     ctx.fillStyle = grd;
//     bars = 100;
//     for (var i = 0; i < bars; i++) {
//         bar_x = i * 3;
//         bar_width = 2;
//         bar_height = -(fbc_array[i] / 3);
//         ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
//     }
// }





//var cvs = document.getElementById('cvs'),
//    context = cvs.getContext("2d");
//console.log(cvs);
//var numDots = 2000,
//    n = numDots,
//    currDot,
//    maxRad = 300,
//    minRad = 20,
//    radDiff = maxRad - minRad,
//    dots = [],
//    PI = Math.PI,
//    centerPt = { x: 0, y: 0 };

//resizeHandler();
//window.onresize = resizeHandler;

//while (n--) {
//    currDot = {};
//    currDot.radius = minRad + Math.random() * radDiff;
//    currDot.ang = (1 - Math.random() * 2) * PI;
//    currDot.speed = (1 - Math.random() * 2) * 0.025;
//    currDot.intensity = Math.round(Math.random() * 255);
//    currDot.fillColor = "rgb(255,0,0)";
//    dots.push(currDot);
//}

//function drawPoints() {
//    n = numDots;
//    var _centerPt = centerPt,
//      _context = context,
//      dX = 0,
//      dY = 0;

//    _context.clearRect(0, 0, cvs.width, cvs.height);

//    draw dots
//    while (n--) {
//        currDot = dots[n];
//        dX = _centerPt.x + Math.sin(currDot.ang) * currDot.radius;
//        dY = _centerPt.y + Math.cos(currDot.ang) * currDot.radius;

//        currDot.ang += currDot.speed;

//        console.log(currDot);
//        _context.fillStyle = currDot.fillColor;
//        _context.fillRect(dX, dY, 1, 1);

//    } //draw dot
//    window.requestAnimationFrame(drawPoints);
//}

//function resizeHandler() {
//    var box = cvs.getBoundingClientRect();
//    var w = box.width;
//    var h = box.height;
//    cvs.width = w;
//    cvs.height = h;
//    centerPt.x = Math.round(w / 2);
//    centerPt.y = Math.round(h / 2);
//}


//function resizeHandler() {
//    var box = cvs.getBoundingClientRect();
//    var w = box.width;
//    var h = box.height;
//    cvs.width = w;
//    cvs.height = h;
//    centerPt.x = Math.round(w / 2);
//    centerPt.y = Math.round(h / 2);
//}

//drawPoints();
