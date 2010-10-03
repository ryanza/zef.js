express = require 'express'
redis = require 'redis'
encrypt = require './newbase60'

app = express.createServer()
db = redis.createClient()

db.debug_mode = true;

app.configure ->
	app.use(express.bodyDecoder())
	app.register '.haml', require 'hamljs'
	
app.configure 'development', ->
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

app.get '/', (req, res) ->
	res.render "index.haml"
	
app.get '/:short', (req, res) ->
	key = req.params.short
	
	db.get key, (err, reply) ->
		unless reply
			res.redirect '/'
		else
			console.log(reply.toString())
			res.send(reply.toString())
	
app.post '/s', (req, res) ->
	url = req.body.url
	
	db.get url, (err, reply) ->
		if reply
			res.send(reply.toString())
		else
			db.incr 'ids', (err, reply) ->
				key = encrypt.numToSxg(reply)
				
				db.set key, url, (err, reply) ->
					db.set url, key, (reply) ->
						res.send(key)
		
app.listen 3000