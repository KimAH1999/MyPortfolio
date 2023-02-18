<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $visitor_email = $_POST["email"];
  $message = $_POST["message"];

  // do something with the data, e.g. send an email
  $email_from ='KimberlyAH@portfolio.com';

  $email_subject = "New Form Sumbmission";

  $email_boby = "User Name: $name.\n".
                  "User Email: $visitor_email.\n".
                    "User Message: $message.\n";

  $to = 'kimaguilar2017@gmail.com';

  $headers = "From: $email_from \r\n";

  $headers .="Reply-To: $visitor_email \r\n";

  mail($to,$email_subject,$email_body,$headers);

  header("Location: contact.html");

  echo "Thanks for your message, $name!";
}

?>
