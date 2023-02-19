<?php

require __DIR__ . '/vendor/autoload.php';

use Google\Auth\Credentials\ServiceAccountCredentials;
use Google\Client;
use Google\Service\Gmail;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = htmlspecialchars($_POST["name"]);
  $visitor_email = htmlspecialchars($_POST["email"]);
  $message = htmlspecialchars($_POST["message"]);

  // Validate email address
  if (!filter_var($visitor_email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email address");
  }

  // Set up Gmail API client
  $client = new Google\Client();
  $client->setApplicationName('MyPortfolio');
  $client->setScopes([Google\Service\Gmail::GMAIL_SEND]);
  $client->setAuthConfig(__DIR__ . '/path/to/service-account-credentials.json');
  $client->setAccessType('offline');
  $client->setPrompt('select_account consent');

  $credentials = new ServiceAccountCredentials($client->getConfig()['authConfig']);
  $client->setAccessToken($credentials->fetchAccessToken()['access_token']);

  $gmail = new Gmail($client);

  // Construct email message
  $subject = 'New Form Submission';
  $message_text = "User Name: $name.\n" .
                  "User Email: $visitor_email.\n" .
                  "User Message: $message.\n";
  $message = new Google\Service\Gmail\Message();
  $message->setRaw(base64_encode("From: KimberlyAH@MyPortfolio.com\r\nTo: kimaguilar2017@gmail.com\r\nSubject: $subject\r\n\r\n$message_text"));

  try {
    $message = $gmail->users_messages->send('me', $message);
    header("Location: contact.html");
    echo "Thanks for your message, $name!";
  } catch (Exception $e) {
    die("Error sending email: " . $e->getMessage());
  }
}

?>

