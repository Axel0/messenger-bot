'use strict'
const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const app=express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());

app.get('/', function(req,res){
	res.send('Hello, I am a chat bot')
});

app.get('/webhook', function(req,res){
	if (req.query['hub.verify_token']=== 'my_name_is_mine'){
		res.send(req.query['hub_challange'])
	}
	else res.send('Error, wrong token')
});

app.listen(app.get('port'),function(){
	console.log('running on port', app.get('port'))
});