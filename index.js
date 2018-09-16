"use strict";

const express = require('express');
const https = require('https');
const app = express();

require('dotenv').config();

const listen_ip_address = process.env.LISTEN_IP || '0.0.0.0';
const listen_port = process.env.LISTEN_PORT || 3000;
const home_assistant_url = process.env.HOME_ASSISTANT_URL || 'http://localhost:8123';

if (process.env.ALLOW_INSECURE_HTTPS) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

app.get('/api/torque', (request, response) => {
  const { url } = request;

  if(!request.query) {
    console.log('Invalid request: Query string missing!');

    return response.status(400)
                   .send();
  }

  if (!request.query.eml) {
    console.log('Invalid request: Email address missing in query string!');
    
    return response.status(400)
                   .send();
  }
  
  https.get(`${home_assistant_url}${url}`);

  response.status(200)
          .send('OK!');
})

app.listen(listen_port, listen_ip_address, () => {
  console.log(`Torque Proxy API listening on http://${listen_ip_address}:${listen_port}!`);
});
