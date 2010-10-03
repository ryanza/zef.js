var app, express;
express = require('express');
app = express.createServer();
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
app.post('/s', function(req, res) {
  console.log(req.body.url);
  return res.redirect('back');
});
app.listen(3000);