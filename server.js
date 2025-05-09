const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();
app.use(bodyParser.json());

webpush.setVapidDetails(
  'mailto:breaktyo@gmail.com',
  'BLSirykAvybJ-FUyEEKKwePL09f7dvd9tupui8s0DNxdNPAGATi44VqNecwsvb0OQPqTgozfqMO88kiTpXx2Oi4',
  '5EVekh2sBg2oC9C0QXZIx3eHxzLSl4scoS2okpduwQA'
);

const subscriptions = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.post('/sendNotification', (req, res) => {
  const payload = JSON.stringify({
    title: 'Nowy mem!',
    body: 'Sprawdź nowy śmieszny kot 😺'
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(error => {
      console.error('Push error:', error);
    });
  });

  res.status(200).json({ message: 'Notifications sent' });
});

app.listen(3000, () => console.log('Server started on port 3000'));
