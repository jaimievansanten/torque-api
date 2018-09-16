const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')

const ip = "0.0.0.0"
const port = 3000
const home_assistant_url = 'https://home.jaimie.me:65321'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/torque', (request, response) => {
  const { url, headers } = request;
  
  console.log({url, headers})

  https.get(`${home_assistant_url}${url}`);

  response.send('Ok!')
})

app.listen(port, ip, () => console.log(`Torque Proxy API listening on port ${port}!`))
