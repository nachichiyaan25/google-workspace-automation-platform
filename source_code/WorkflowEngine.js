function executeWorkflow(
  thread,
  emailContext
) {

  Logger.log("----------------------------------------");
  Logger.log("Executing Workflow...");
  Logger.log("----------------------------------------");

  // Load Email Template Configuration

  const template =
    getEmailTemplateConfiguration(
      emailContext.alias.template
    );

  // Check Auto Reply Status

  if (
    emailContext.alias.autoReply
      .trim()
      .toLowerCase() !== "enabled"
  ) {

    Logger.log("Auto Reply Disabled.");

    return;

  }

  // Build Template Variables

  const variables =
    buildVariables(
      emailContext,
      template
    );

  // Build Email Attachments

  const attachments =
    buildAttachments(
      template
    );

  // Prepare Reply Email

  const preparedEmail =
    prepareIncomingEmailReply(
      emailContext.alias,
      variables,
      attachments
    );

  Logger.log("Prepared Email:");
  Logger.log(preparedEmail);

  // Reply to Email Thread

  replyToEmailThread(
    thread,
    preparedEmail
  );

  // Notify Stakeholders

  notify(
    "INCOMING_EMAIL",
    emailContext
  );

  Logger.log("Workflow Executed Successfully.");

}