'use strict'
const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const app=express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.get('/', function(req,res){
	res.send('Hello, I am a chat bot')
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "my_name_is_mine") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

//Receive messages

app.post('/webhook/', function(req,res){

    var data=req.body;
    if(data.object==='page'){
      data.entry.forEach(function(entry){
        var pageID=entry.id;
        var timeOfEvent=entry.time;

        entry.messaging.forEach(function(event){

          if (event.message){
            receivedMessage(event);

          }
          //This part should be handling a postback coming from the structured message defined in sendGenericMessage function //
          else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);   
        }
          else {
            console.log("Webhook received unknown event:", event);
          }
        })
      })
    }

});

//Send Message

function receivedMessage(event){
  var senderID=event.sender.id;
  var recipientID=event.recipient.id;
  var timeOfMessage= event.timestamp;
  var message=event.message;

  console.log("Received message for user %d and page %d are %d with message: ", senderID, recipientID, message);
  console.log(JSON.stringify(message));

  var messageId=message.mid;

  var messageText= message.text;
  var messageAttachments = message.attachments;

  if(messageText){
    switch(messageText){
      case 'generic':
      sendGenericMessage(senderID);
      break;

     default: 
     sendTextMesssage(senderID, messageText);

    }

  }else if (messageAttachments){
    sendTextMesssage(senderID, "Message with attachments received");
  }
}

//Here it is a structuredMessage returning an element with a button and a callback to a generic message.//

 function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

function receivedPostback(event){
  var senderID= event.sender.id;
  var recipientID=event.recipient.id;
  var timeOfPostback=event.timestamp;
  var payload=event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' + at %d", senderID, recipientID, timeOfPostback, timeOfPostback);
  sendTextMessage(senderID, "Postback Called");
}

  function sendTextMessage(recipientID, messageText ){
    var messageData={
      recipient:{
        id:recipientID
      },
      message:{
        text:messageText
      }

    };

    callSendApi(messageData);
  }


  function callSendApi(messageData){
    request({
      uri: 'http://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: Page_Access_Token},
      method: 'POST',
      json: messageData
    },function(error, response, body){

      if (!error && response.statusCode==200){
        var recipientID= body.recipient_id;
        var messageID=body.message_id;
        console.log("Successfully sent generic message with id %s to recipient %s ", messageID, recipientID );
      }else{
        console.error("Unable to send message.");
        console.error(response);
        console.error(error);
      }
    });
  }

app.listen(app.get('port'),function(){
	console.log('running on port', app.get('port'))
});

