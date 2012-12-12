
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  // , comic = require('./routes/comic')
  , http = require('http')
  , https = require('https')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/comic/:id', function(req, res) {
	var comic = comics[req.param('id')];
	if (!comic) {
		res.send('Comic not found', 404);
	} else {
		res.send('<img src="' + comic.img + '"/>');
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/**
 * Setup xkcd miner
 */
 
var rest = require('./rest');
var fs = require('fs');

var comics = [];

var options = {
	host: 'www.xkcd.com',
	port: 80,
	path: '/info.0.json',
	method: 'GET',
};

try {
	comics = fs.readFileSync('comics.json');
	comics = JSON.parse(comics);
} catch(e) { // Fail silently: If we don't have a file, we ignore it.
	comics = [];
}

var processComics = function() {
	console.log('Processing Comics...');
	rest.getJSON(options, function(res, obj) {
		var totalCount = obj.num;
		var lastComic = comics[comics.length - 1];
		if (!lastComic) {
			lastComic = {num: 0};
		}
		for (var i = totalCount; i > lastComic.num; i--) {
			var options = {
				host: 'www.xkcd.com',
				port: 80,
				path: '/' + i + '/info.0.json',
				method: 'GET',
			};
		
			rest.getJSON(options, function(res, obj) {
				console.log('Processed Comic: ' + obj.num);
				comics[obj.num] = obj;
			
				if (obj.num == lastComic.num + 1) {
					fs.writeFileSync("comics.json", JSON.stringify(comics));
				}
			});
		}
	});
}

processComics();
// Reprocess comics once every 3 days
var processComicsInterval = setInterval(processComics, 1000 * 60 * 60 * 24 * 3);