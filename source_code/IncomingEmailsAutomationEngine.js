function processIncomingEmails() {

  Logger.log("----------------------------------------");
  Logger.log("Checking Inbox...");
  Logger.log("----------------------------------------");
  
  // Get Incoming Email Threads

  const threads =
    discoverIncomingEmailThreads();

  Logger.log(
    "Fetched Latest Threads: " +
    threads.length
  );

  // Process Email Threads 

  for (const thread of threads) {

    Logger.log("----------------------------------------");
    Logger.log("Processing Incoming Conversation...");
    Logger.log("----------------------------------------");

    // Build Event ID

    const eventId =
      buildEventId(
        "gmail",
        thread.getId()
      );

    // Check Processed Event

    if (
      isEventHandled(
        eventId
      )
    ) {

      continue;

    }

    // Build Email Context
    
    const emailContext =
      buildEmailContext(
        thread
      );

    if (!emailContext) {

      continue;

    }

    // Execute Workflow

    executeWorkflow(
      thread,
      emailContext
    );

    // Log Processed Event

    logProcessedEvent(
      eventId,
      "gmail",
      "INCOMING_EMAIL"
    );

  }

}


function discoverIncomingEmailThreads() {

  Logger.log("----------------------------------------");
  Logger.log("Discovering Incoming Email Threads...");
  Logger.log("----------------------------------------");

  // Search Recent Email Threads

  const threads =
    GmailApp.search(
      "in:inbox",
      0,
      20
    );

  const incomingThreads = [];

  for (const thread of threads) {

    if (
      thread.getMessageCount() !== 1
    ) {

      continue;

    }

    // Load Latest Email Message

    const latestMessage =
      thread
        .getMessages()[0];

    // Extract Participants

    const participants =
      extractEmailParticipants(
        latestMessage
      );

    // Ignore Platform Generated Email

    if (
      isPlatformEmail(
        participants.senderEmail
      )
    ) {

      Logger.log(
        "Ignored Platform Generated Email."
      );

      continue;

    }

    incomingThreads.push(
      thread
    );

  }

  Logger.log(
    "New Conversations Found: " +
    incomingThreads.length
  );

  return incomingThreads;

}


function buildEmailContext(
  thread
) {

  Logger.log("----------------------------------------");
  Logger.log("Building Email Context...");
  Logger.log("----------------------------------------");

  // Load Email Messages

  const messages =
    thread.getMessages();

  Logger.log(
    "Messages Found: " +
    messages.length
  );

  // Load Latest Email Message

  const latestMessage =
    messages[
      messages.length - 1
    ];

  Logger.log("Latest Message Loaded Successfully.");

  // Extract Email Participants

  const participants =
    extractEmailParticipants(
      latestMessage
    );

  // Load Email Alias Configuration

  Logger.log("Loading Email Alias Configuration...");

  const alias =
    getEmailAliasConfiguration(
      participants.aliasEmail
    );

  // Check Email Alias Configuration

  if (!alias) {

    Logger.log("No Email Alias Configuration Found.");

    return null;

  }

  // Load Google Form Configuration

  Logger.log("Loading Google Form Configuration...");
  
  const form =
    alias.formName
      ? getFormConfiguration(
          alias.formName
        )
      : null;

  const emailContext = {

    senderName:
      participants.senderName,

    senderEmail:
      participants.senderEmail,

    alias,

    subject:
      latestMessage.getSubject(),

    attachments:
      latestMessage.getAttachments(),

    form

  };

  Logger.log("Email Context Built Successfully.");

  return emailContext;

}


function prepareIncomingEmailReply(
  alias,
  variables,
  attachments
) {

  Logger.log("----------------------------------------");
  Logger.log("Preparing Automated Email Reply...");
  Logger.log("----------------------------------------");

  // Load Email Template Configuration

  const template =
    getEmailTemplateConfiguration(
      alias.template
    );

  // Replace Template Variables

  const body =
    replaceVariables(
      template.body,
      variables
    );

  // Convert Email Body to HTML

  const htmlContent =
    convertToHtml(
      body
    );

  // Build Organization Identity

  const identity = {

    displayName: alias.displayName,

    email: alias.email

  };

  // Apply Organization Identity

  const htmlBody =
    applyIdentity(
      htmlContent,
      identity
    );

  Logger.log("Automated Email Reply Prepared Successfully.");

  return {

    from: alias.email,

    fromName: alias.displayName,

    subject: template.subject,

    body,

    htmlBody,

    attachments

  };

}


function replyToEmailThread(
  thread,
  email
) {

  Logger.log("----------------------------------------");
  Logger.log("Replying to Email Thread...");
  Logger.log("----------------------------------------");

  // Reply to Email Thread

  thread.reply(
    email.body,
    {

      from: email.from,

      name: email.fromName,

      htmlBody: email.htmlBody,

      attachments: email.attachments

    }
  );

  Logger.log("Email Thread Replied Successfully.");

  // Mark Thread as Read

  thread.markRead();

  Logger.log("Email Thread Marked as Read.");

}