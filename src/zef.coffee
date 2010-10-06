express = require 'express'
redis = require 'redis'
encrypt = require './newbase60'

app = express.createServer()
db = redis.createClient()

db.debug_mode = true;

app.configure ->
  app.use(express.bodyDecoder())
  app.register '.haml', require 'hamljs'

app.get '/', (req, res) ->
  res.render "index.haml"
  
app.post '/', (req, res) ->
  url = if req.body.url.search(/^http/) == -1 then "http://" + req.body.url else req.body.url    
  
  db.get url, (err, reply) ->
    if reply
      res.send(reply.toString())
    else
      db.incr 'ids', (err, reply) ->
        key = encrypt.numToSxg(reply)
        
        db.set key, url, (err, reply) ->
          db.set url, key, (reply) ->
            res.send(key)

app.get '/:short', (req, res) ->
  key = req.params.short

  db.get key, (err, reply) ->
    unless reply
      res.redirect '/'
    else
      res.redirect reply.toString()
    
app.listen 3000