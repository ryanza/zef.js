express = require('express')

app = express.createServer()

app.configure ->
	app.use(express.bodyDecoder())
	app.register '.haml', require 'hamljs'
	
app.configure 'development', ->
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

app.get '/', (req, res) ->
	res.render "index.haml"
	
app.post '/s', (req, res) ->
	console.log req.body.url
	res.redirect 'back'

app.listen 3000