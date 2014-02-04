var flatiron = require('flatiron'),
    fs = require('fs-extra'),
    path = require('path'),
    io = require('socket.io'),
    app = flatiron.app;

// read config
app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

// use server plugin
app.use(flatiron.plugins.http);

// define server routes
app.router.get('/', function () {
  
  var res = this.res;
  
  app.log.info('request on /');

  fs.readFile(path.join(__dirname, 'index.html'), function (err, data) {
    // if there was an error
    if (err) {
      app.log.error(err);
      // answer with error
      res.writeHead(500, { 'Content-Type': 'text/html' })
      return res.end("not found! " + err);
    }
    // otherwise, answer with the data
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(data.toString());
    
  })
  
});


// start the server on the configured port
var port = app.config.get('port');
app.start(port, function () {
  app.log.info("Server started on %s", port)
});

// rpi gpio
var gpio = require('gpio');

// Socket.io stuff
io.listen(app.config.get('socketPort'));

io.sockets.on('connection', function (socket) {
  
  gpio.pin8.on('push', function () {
    socket.emit('action', 'start');
  });
  
  
});



