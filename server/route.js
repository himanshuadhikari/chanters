module.exports = function(app, express) {
    var path = require('path');
    var url = __dirname + '/../';

    __dirname = path.join(url);



    app.use(express.static(__dirname + "/public"));
    app.engine('html', require('ejs').renderFile);



    app.get('/', function(req, res) {
        res.render(__dirname + '/public/index.html');
    });
    app.get('/', function(req, res) {
        res.render(__dirname + '/public/view/player.html');
    });

    app.get('/development', function(req, res) {
        res.render(__dirname + '/public/view/development.html');
    });

    app.get('/login', function(req, res) {
        res.render(__dirname + '/public/view/login.html');
    });

    app.get('/register', function(req, res) {
        res.render(__dirname + '/public/view/register.html');
    });

    app.get('/practice', function(req, res) {
        res.render(__dirname + '/public/practice.html');
    });

    app.get('/production', function(req, res) {
        res.render(__dirname + '/public/view/production.html');
    });
    app.get('/default', function(req, res) {
        // res.render(__dirname + '/public/view/home.html');
        res.render(__dirname + '/public/index_.html');
    });

    app.get('/player', function(req, res) {
        res.render(__dirname + '/public/view/player.html');
    });
    app.get('/demoPlayer', function(req, res) {
        res.render(__dirname + '/public/view/demoPlayer.html');
    });

    app.get('/home', function(req, res) {
        res.render(__dirname + '/public/view/home.html');
    });

    app.get('/songList', function(req, res) {
        var fs = require('fs');
        fs.readdir("/home/himanshu/Videos", function(err, data) {
            res.send(JSON.stringify(data));
        })
    });

    app.get('/tictactoe', function(req, res) {
        res.render(__dirname + '/public/view/tic-tac-toe.html');
    });

    app.get('/home/himanshu/Videos/:name', function(req, res) {
        var fs = require('fs');
        var filePath = "/home/himanshu/Videos/" + req.params.name;

        if (req.params.name.indexOf(".mp4") !== -1) {
            var range = req.headers.range;
            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            fs.stat(filePath, function(err, stats) {
                var total = stats.size;
                var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                var chunksize = (end - start) + 1;

                res.writeHead(206, {
                    "Content-Range": "bytes " + start + "-" + end + "/" + total,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunksize,
                    "Content-Type": "video/mp4"
                });

                var stream = fs.createReadStream(filePath, {
                        start: start,
                        end: end
                    })
                    .on("open", function() {
                        stream.pipe(res);
                    }).on("error", function(err) {
                        res.end(err);
                    });
            });
        } else {
            var stat = fs.statSync(filePath);

            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': stat.size
            });

            var readStream = fs.createReadStream(filePath);
            util.pump(readStream, res);
        }

    });


    return module.exports;

}
