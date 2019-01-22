"use strict";

const express = require('express');
//const https = require('https');
const r = require('request');
const app = express();

require('dotenv').config();

const listen_ip_address = process.env.LISTEN_IP || '0.0.0.0';
const listen_port = process.env.LISTEN_PORT || 3000;
const home_assistant_url = process.env.HOME_ASSISTANT_URL || 'http://localhost:8123';
const allow_insecure_https = process.env.ALLOW_INSECURE_HTTPS || false;
const token = process.env.TOKEN || '';

app.use(express.json());

if (allow_insecure_https) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

app.get('/health', (request, response) => {
  return response.status(200)
                 .send('OK');
});


app.post('/api/states/input_boolean.is_marike_sleeping', (request, response) => {
  const state = request.body.state;

  console.log(`${new Date()}: Request to Marike Sleeping API (state: ${state}`);

  r.post({
    url: `${home_assistant_url}/api/states/input_boolean.is_marike_sleeping`,
    auth: { bearer: token },
    json: { state: state }
  })
  .on('response', (res) => {
    console.log(`Push to Home Assistant complete: ${res.statusCode}.`, `Data: ${state}`);
  })
  .on('error', (error) => {
    console.log(`Error while pushing data to Home Assistant: ${error.message}`, error);
  });

  response.sendStatus(200);
});

app.get('/api/torque', (request, response) => {
  const { url } = request;
  console.log(`${new Date()}: Request to Torque API`);

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

  r.get(`${home_assistant_url}${url}`, {
    auth: {
      bearer: token
    }
  })
  .on('response', (res) => {
    console.log(`Push to Home Assistant complete: ${res.statusCode}.`, `Data: ${url}`);
  })
  .on('error', (error) => {
    console.log(`Error while pushing data to Home Assistant: ${error.message}`, error);
  });

  response.status(200)
          .send('OK!');
})

app.listen(listen_port, listen_ip_address, () => {
  console.log(`Torque Proxy API listening on http://${listen_ip_address}:${listen_port}!`);
});
