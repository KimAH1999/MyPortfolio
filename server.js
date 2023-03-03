const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const clientSecret = JSON.parse(process.env.CLIENT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the public directory
app.use(express.static('public'));

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// GET Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// POST route for contact form submission
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      clientSecret.web.client_secret,
      process.env.REDIRECT_URL
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'kimaguilar2017@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: clientSecret.web.client_secret,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: await oAuth2Client.getAccessToken().catch(error => {
          console.error('Error getting access token:', error);
        }),
      },
    });

    try {
      await transport.sendMail({
        from: 'Kimberly Y Aguilar Hermoso <kimaguilar2017@gmail.com>',
        to: 'kimaguilar2017@gmail.com',
        subject: 'New Contact Form Submission',
        html: `
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Message: ${message}</p>
        `,
      });

      res.status(200).send('Message sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending message');
    }
  } catch (error) {
    console.error('Error creating OAuth2 client:',
