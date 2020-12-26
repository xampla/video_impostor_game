const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const https = require('https');
var config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var api = express.Router();

api.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

function sendEmail(emailPlayer,word,role) {
  const oauth2Client = new OAuth2(
       config.mail.clientId, // ClientID
       config.mail.clientSecret, // Client Secret
       config.mail.redirectURL // Redirect URL
  );
  oauth2Client.setCredentials({
       refresh_token: config.mail.refreshToken
  });
  const accessToken = oauth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
     service: "Gmail",
     auth: {
          type: "OAuth2",
          user: config.mail.user,
          clientId: config.mail.clientId,
          clientSecret: config.mail.clientSecret,
          refreshToken: config.mail.refreshToken,
          accessToken: accessToken
     }
   });

   var body = "";
   if(role) body = "<h1>IMPOSTOR GAME</h1><p>Te ha tocado ser <u>IMPOSTOR</u></p><p>Gracias por jugar.</p>";
   else body = "<h1>IMPOSTOR GAME</h1><p>La palabra que te ha tocado es: <u>"+word+"</u>.</p><p>Gracias por jugar.</p>"

   const mailOptions = {
      from: config.mail.user,
      to: emailPlayer,
      subject: "[IMPOSTOR GAME] Distribución de roles",
      generateTextFromHTML: true,
      html: body
     };

  smtpTransport.sendMail(mailOptions, function (err_send_email, info) {
    return true;
  });
}

async function getWord(callback) {
  var options = {
    host: "www.palabrasaleatorias.com",
    port: 443,
    headers: {'User-Agent': 'Firefox'}
  };
  https.get(options, function(response) {
    var str = '';

    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been received, so we just print it out here
    response.on('end', function () {
      var w = str.substring(str.lastIndexOf('<div style="font-size:3em; color:#6200C5;">'), str.lastIndexOf("</div>"));
      w = w.replace(/<div style="font-size:3em; color:#6200C5;">/g,"");
      callback(w);
    });
  });
}

api.post('/', (req, res) => {
  var players = JSON.parse(req.body.email);
  var num_players = Object.keys(players).length;
  getWord(function(word){
    console.log("PALABRA: " + word)
    var impostor = Math.floor(Math.random()* (num_players+1 - 1) + 1);
    try {
      var j = 1;
      for(var p_email in players) {
        var role = 0;
        if(j==impostor) role = 1;
        sendEmail(players[p_email], word, role);
        j+=1;
      }
    }
    catch(e){console.log(e)}
    console.log("Emails sent!")
  });
  res.json("hi");
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});

app.use(api);
