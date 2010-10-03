var app, db, encrypt, express, redis;
express = require('express');
redis = require('redis');
encrypt = require('./newbase60');
app = express.createServer();
db = redis.createClient();
db.debug_mode = true;
app.configure(function() {
  app.use(express.bodyDecoder());
  return app.register('.haml', require('hamljs'));
});
app.configure('development', function() {
  return app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});
app.get('/', function(req, res) {
  return res.render("index.haml");
});
app.get('/:short', function(req, res) {
  var key;
  key = req.params.short;
  return db.get(key, function(err, reply) {
    if (!(reply)) {
      return res.redirect('/');
    } else {
      console.log(reply.toString());
      return res.send(reply.toString());
    }
  });
});
app.post('/s', function(req, res) {
  var url;
  url = req.body.url;
  return db.get(url, function(err, reply) {
    return reply ? res.send(reply.toString()) : db.incr('ids', function(err, reply) {
      var key;
      key = encrypt.numToSxg(reply);
      return db.set(key, url, function(err, reply) {
        return db.set(url, key, function(reply) {
          return res.send(key);
        });
      });
    });
  });
});
app.listen(3000);