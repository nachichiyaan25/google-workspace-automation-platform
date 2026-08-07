// ========================================
// Template Utilities
// ========================================


function replaceVariables(
  template,
  variables
) {

  Logger.log("----------------------------------------");
  Logger.log("Replacing Template Placeholders...");
  Logger.log("----------------------------------------");

  // Initialize Template

  let output =
    template;

  // Replace Dynamic Variables

  for (const key in variables) {

    const value =
      variables[key];

    const placeholder =
      "{{" + key + "}}";

    output =
      output.replaceAll(
        placeholder,
        value
      );

  }

  Logger.log("Template Rendered Successfully.");

  return output;

}


function convertToHtml(
  body
) {

  Logger.log("----------------------------------------");
  Logger.log("Converting Content to HTML...");
  Logger.log("----------------------------------------");

  const htmlContent =
    body.replace(
      /\n/g,
      "<br>"
    );

  Logger.log("Content Converted Successfully.");

  return htmlContent;

}


// ========================================
// Google Workspace Utilities
// ========================================


function openGoogleForm(
  formUrl
) {

  // Extract Form ID from URL
  
  const formId =
    formUrl.match(
      /\/d\/([^/]+)/
    )[1];

  // Open Google Form

  const form =
    FormApp.openById(
      formId
    );

  return form;

}


function isPlatformEmail(
  email
) {

  // Load Email Alias Configuration

  const aliases =
    getEmailAliasesConfiguration();

  return aliases.some(
    alias =>
      alias.email === email
  );

}


function extractEmailParticipants(
  message
) {

  Logger.log("----------------------------------------");
  Logger.log("Extracting Email Participants...");
  Logger.log("----------------------------------------");

  // Read Sender

  const sender =
    message.getFrom();

  Logger.log(
    "Sender: " +
    sender
  );

  // Read Recipient

  const recipient =
    message.getTo();

  Logger.log(
    "Recipient: " +
    recipient
  );

  // Extract Sender Details

  const senderName =
    sender.includes("<")
      ? sender.match(
        /^(.*?)\s*</
      )[1]
      : sender;

  const senderEmail =
    sender.includes("<")
      ? sender.match(
        /<(.+)>/
      )[1]
      : sender;

  // Extract Alias Email

  const aliasEmail =
    recipient.includes("<")
      ? recipient.match(
          /<(.+)>/
        )[1]
      : recipient;

  Logger.log(
    "Sender Name: " +
    senderName
  );

  Logger.log(
    "Sender Email: " +
    senderEmail
  );

  Logger.log(
    "Alias Email: " +
    aliasEmail
  );

  Logger.log("Email Participants Extracted Successfully.");

  return {

    senderName,

    senderEmail,

    aliasEmail

  };

}


// ========================================
// Platform Monitoring Utilities
// ========================================


function updatePlatformHeartbeat() {

  // Record Latest Successful Platform Execution
  
  PropertiesService
    .getScriptProperties()
    .setProperty(
      "LAST_SUCCESSFUL_EXECUTION",
      new Date().toISOString()
    );

  Logger.log("Platform Heartbeat Updated.")

}


function runPlatformServicesMonitoring() {

  Logger.log("========================================");
  Logger.log("Running Platform Services Monitoring...");
  Logger.log("========================================");

  // Update Platform Heartbeat

  updatePlatformHeartbeat();

  // Run Platform Health Check

  const report =
    runPlatformServicesHealthCheck();

  // Build Health Context

  const healthContext =
    buildHealthContext(
      report
    );

  // Load Previous Platform Services Status

  const previousStatus =
    getPlatformServicesStatus();

  // Notify Platform Services Degradation

  if (
    !report.healthy &&
    previousStatus === "HEALTHY"
  ) {

    notify(
      "PLATFORM_SERVICES_UNHEALTHY",
      healthContext
    );

    setPlatformServicesStatus(
      "UNHEALTHY"
    );

  }

  // Notify Platform Services Recovery

  if (
    report.healthy &&
    previousStatus === "UNHEALTHY"
  ) {

    notify(
      "PLATFORM_SERVICES_HEALTHY",
      healthContext
    );

    setPlatformServicesStatus(
      "HEALTHY"
    );

  }

  Logger.log("Platform Services Monitoring Completed.");

}


// ========================================
// Platform Execution Utilities
// ========================================


function workspaceAutomation() {

  Logger.log("========================================");
  Logger.log("Starting Workspace Automation...");
  Logger.log("========================================");

  try {

    // Check Platform Services Health

    runPlatformServicesMonitoring();
    
    // Execute Business Automations

    main();

    // Check Platform Recovery

    platformRestoration();

  }

  catch (error) {

    try {

      // Handle Platform Failure

      emergencyResponse(error);

    }

    catch (emergencyError) {

      Logger.log("Emergency Response Failed.");

      Logger.log(emergencyError.stack);

    }

  }

}



// ========================================
// Validation Utilities
// ========================================


function isValidEmail(
  email
) {

  if (!email) {

    return false;

  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );

}


