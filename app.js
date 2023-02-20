const nodemailer = require ('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '174539307268-g3492vvpvj6sst8jpmesjgpf7el2l529.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URL = 'https://developer.google.com/outhplayground';
const REFRESH_TOKEN = '1//04T7pl-SvyModCgYIARAAGAQSNwF-L9Ir5OejS-nLjBFJmJDdfoNlWBMTo0BklaiWtkjZNU-ltKE-ZFONi0z4JSeQGZi39-NYBe0';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN })

async function sendMail(){
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'kimaguilar2017@gmail.com',
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'Kimberly  <kimaguilar2017@gmail.com>',
            to: 'kimaguilar2017@gmail.com',
            subject: 'Hello from gmail using API',
            html: '<h1>Hello from gmail email using API</h1>' +
                  '<p>This is an example email sent using the Gmail API.</p>' +
                  '<p>You can add formatting, links, images, and other HTML elements to your emails.</p>' +
                  '<p>Here is an image:</p>' +
                  '<img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google logo">'
        };
          

        const result = await transport.sendMail(mailOptions)
        return result;
    } catch (error){
        return error;
    }
}

sendMail()
    .then((result)=> console.log('Email sent...', result))
    .catch((error)=> console.log(error.message));