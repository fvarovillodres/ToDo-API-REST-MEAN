/*server.js*/

//requerimos las librerias que dependeremos e iniciamos la app
var express = require('express'),
	mongoose = require('mongoose'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	path = require('path'),
	methodOverride = require('method-override'),
	app = express();//iniciamos express

//conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/angular-todo');
var Todo = require('./models n schemas/todoModel').Todo;

//configuración general del servidor
//app.configure(function() {
	//localización de los ficheros estáticos
	//app.use(express.static(__dirname + 'public'));
	app.use(express.static(path.join(__dirname, 'public')));
	//mostrar un log de todos los request en la consola
	app.use(logger('dev'));
	//permite cambiar el HTML con el método POST
	app.use(bodyParser.json());
	//simula DELETE y PUT
	app.use(methodOverride());
//});

var index = require(__dirname + '/controllers n routes/index.js');
app.use('/', index);


var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection',function(socket){
	socket.on('saveOne',function(dataIn){
		//console.log(dataIn);
		Todo.create({
			text: dataIn.text,
			done: false
		}, function (err, todo) {
				if(err){
					console.log(err);
				}
				Todo.find(function(err, todos) {
					if(err){
						console.log(err);
					}
					//console.log(todos);
					socket.emit('sendAll', todos);
					socket.broadcast.emit('sendAll', todos);//res.json(todos);
				});
			});
	});
});
io.on('connection', function(socket){
  socket.on('mensage', function(msg){
    console.log('message: ' + msg.saludo);
	socket.emit('retorno',{devuelta:"Hola"});
  });
});

http.listen(8080, function(){
  console.log('listening on localhost:8080');
});
