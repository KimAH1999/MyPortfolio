const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

    // Create a nodemailer transport object
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'kimaguilar2017@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
      },
    });

    // Send email using nodemailer
    await transport.sendMail({
      from: 'Kimberly <kimaguilar2017@gmail.com>',
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
    console.error(error);
    res.status(500).send('Error sending message');
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
