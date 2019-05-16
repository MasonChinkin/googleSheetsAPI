const express = require('express');
const router = express.Router();
const {
  google
} = require('googleapis');
const sheets = google.sheets('v4');

let clientEmail, privateKey;
if (process.env.NODE_ENV === 'production') {
  clientEmail = process.env.GOOGLEAPI_CREDENTIALS_CLIENT_EMAIL
  privateKey = process.env.GOOGLEAPI_CREDENTIALS_PRIVATE_KEY
} else {
  const privateKeyJSON = require('../bin/privateKey.json')
  clientEmail = privateKeyJSON.client_email
  privateKey = privateKeyJSON.private_key
}


router.get('/', function (req, res, next) {

  // configure a JWT auth client
  let jwtClient = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']);
  //authenticate request
  jwtClient.authorize(function (err, tokens) {
    (err) ? console.log(err): console.log("Successfully connected!")
  });

  let request = {
    spreadsheetId: '1i1G-XpcjXXe0X012ovtwZC7uJ4ADOsVB6W_Gw8vWngs', // TODO: Update placeholder value.
    range: 'Public View', // TODO: Update placeholder value.
    auth: jwtClient,
  };

  sheets.spreadsheets.values.get(request, function (err, response) {
    if (err) {
      console.error(err);
      return;
    }

    res.status(200).json(response.data.values)
  })
})

module.exports = router;