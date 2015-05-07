var express = require('express'),
	formidable = require('formidable'),
	fs = require('fs'),
	publicDir = (typeof process.env.PUBLIC_DIR == 'string' && process.env.PUBLIC_DIR != "") ? __dirname+process.env.PUBLIC_DIR : __dirname+'/public/',
	rootURI = (typeof process.env.ROOT_URI == 'string' && process.env.ROOT_URI != "") ? process.env.ROOT_URI : '/';

if (typeof process.env.KEY != "string"){
	console.log('No KEY var!');
	process.exit(1);
}

fs.lstat(publicDir, function(err, stats) {
	if (err || !stats.isDirectory()) {
		fs.mkdir(publicDir);
	}
});

var app = express();

app.use(express.static(publicDir));

app.get('/', function (req, res) {
	var dir = publicDir,
		files = fs.readdirSync(dir),
		json = [];

	files.sort(function(a, b) {
		return fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime();
	});

	for (var i in files){
		json.push({name: files[i], date: fs.statSync(dir + files[i]).mtime.getTime(), uri: rootURI+files[i]});
	}

	return res.json(json);
});

app.delete('/:file', function (req, res) {
	if (req.headers.authorization != "KEY "+process.env.KEY){
		return res.status(403).json({message: "Forbidden"});
	}
	else {
		console.log('Deleting '+req.params.file);
		fs.unlinkSync(publicDir+req.params.file);

		return res.status(204).end();
	}
});

app.post('/', function (req, res) {
	if (req.headers.authorization != "KEY "+process.env.KEY){
		return res.status(403).json({message: "Forbidden"});
	}
	else {
		var form = new formidable.IncomingForm();
		form.uploadDir = publicDir;

		form.parse(req, function(err, fields, files) {
			console.log("Receiving "+files.fileupload.name);
			var path = publicDir+files.fileupload.name,
				uri = rootURI+files.fileupload.name;

			fs.renameSync(files.fileupload.path, path);
			return res.status(201).json({name: files.fileupload.name, date: fs.statSync(path).mtime.getTime(), uri: uri});
		});
	}
});

var server = app.listen(parseInt(process.env.PORT) || 3000, function () {
	console.log('App listening at http://%s:%s', server.address().address, server.address().port);
});
