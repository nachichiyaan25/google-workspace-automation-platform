function sendEmail(
  preparedEmail,
  recipient
) {

  Logger.log("----------------------------------------");
  Logger.log("Sending Email...");
  Logger.log("----------------------------------------");

  GmailApp.sendEmail(
    recipient,
    preparedEmail.subject,
    preparedEmail.body,
    {
      htmlBody: preparedEmail.htmlBody,
      from: preparedEmail.from,
      name: preparedEmail.fromName
    }
  );

  Logger.log("Email Sent Successfully.");
}