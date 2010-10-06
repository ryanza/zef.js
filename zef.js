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
app.get('/', function(req, res) {
  return res.render("index.haml");
});
app.post('/', function(req, res) {
  var url;
  url = req.body.url.search(/^http/) === -1 ? "http://" + req.body.url : req.body.url;
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
app.get('/:short', function(req, res) {
  var key;
  key = req.params.short;
  return db.get(key, function(err, reply) {
    return !(reply) ? res.redirect('/') : res.redirect(reply.toString());
  });
});
app.listen(3000);