const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the public directory
app.use(express.static('public'));

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// GET Route for homepage
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// POST route for contact form submission
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({
      access_token: process.env.ACCESS_TOKEN,
      refresh_token: process.env.REFRESH_TOKEN,
      scope: 'https://www.googleapis.com/auth/gmail.send',
      token_type: 'Bearer',
      expiry_date: Number(process.env.EXPIRY_DATE),
    });

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'kimaguilar2017@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
        expires: Number(process.env.EXPIRY_DATE),
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
      
      res.sendFile(path.join(__dirname, '/public/message.html'));
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending message');
    }
  } catch (error) {
    console.error('Error creating OAuth2 client:', error);
    res.status(500).send('Error sending message form');
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
