function runPlatformServicesHealthCheck() {

  Logger.log("========================================");
  Logger.log("Running Platform Services Health Check...");
  Logger.log("========================================");

  // Build Health Report

  const report = {

    timestamp: new Date(),

    healthy: true,

    checks: []

  };

  Logger.log("Health Report Initialized.");

  // Check Configuration

  const configurationCheck =
    checkConfiguration();

  report.checks.push(
    configurationCheck
  );

  if (
    !configurationCheck.healthy
  ) {

    report.healthy = false;

  }

  // Check Gmail

  const gmailCheck =
    checkGmail();

  report.checks.push(
    gmailCheck
  );

  if (
    !gmailCheck.healthy
  ) {

    report.healthy = false;

  }

  // Check Drive

  const driveCheck = 
    checkDrive();

  report.checks.push(
    driveCheck
  )

  if (
    !driveCheck.healthy
  ) {

    report.healthy = false;

  }

  // Check Forms

  const formsCheck = 
    checkForms();

  report.checks.push(
    formsCheck
  )

  if (
    !formsCheck.healthy
  ) {

    report.healthy = false;

  }

  // Check Automated Trigger

  const triggerCheck = 
    checkTrigger();

  report.checks.push(
    triggerCheck
  )

  if (
    !triggerCheck.healthy
  ) {

    report.healthy = false;

  }

  // const healthContext = 
  //   buildHealthContext(report)
  
  // notify(
  //   "PLATFORM_SERVICES_HEALTHY",
  //   healthContext
  // )


  // Log Overall Platform Heatlh Report

  Logger.log("Platform Health Check Completed.");

  Logger.log("Health Report:");

  Logger.log(report);

  return report;

}


function checkConfiguration() {

  Logger.log("----------------------------------------");
  Logger.log("Checking Configuration...");
  Logger.log("----------------------------------------");

  const check = {

    name: "Configuration",

    healthy: true,

    message: "Configuration Accessible"

  };

  try {

    // Get Email Aliases Sheet Configuration

    getEmailAliasesConfiguration();

  }

  catch (error) {

    check.healthy = false;

    check.message = error.message;

  }

  Logger.log("Configuration Check:");

  Logger.log(check);

  return check;

}


function checkGmail() {

  Logger.log("----------------------------------------");
  Logger.log("Checking Gmail...");
  Logger.log("----------------------------------------");

  const check = {

    name: "Gmail",

    healthy: true,

    message: "Gmail Accessible"

  };

  try {

    GmailApp.getInboxUnreadCount();

  }

  catch (error) {

    check.healthy = false;

    check.message = error.message;

  }

  Logger.log("Gmail Check:");

  Logger.log(check);

  return check;

}


function checkDrive() {

  Logger.log("----------------------------------------");
  Logger.log("Checking Google Drive...");
  Logger.log("----------------------------------------");

  const check = {

    name: "Google Drive",

    healthy: true,

    message: "Google Drive Accessible"

  };

  try {

    DriveApp.getRootFolder();

  }

  catch (error) {

    check.healthy = false;

    check.message = error.message;

  }

  Logger.log("Google Drive Check:");

  Logger.log(check);

  return check;

}


function checkForms() {

  Logger.log("----------------------------------------");
  Logger.log("Checking Google Forms...");
  Logger.log("----------------------------------------");

  const check = {

    name: "Google Forms",

    healthy: true,

    message: "All Configured Forms Accessible"

  }

  // Load Configured Forms

  const forms =
    getFormsConfiguration();

  // Examine Every Configured Form

  for (const form of forms) {

    try {

      openGoogleForm(form.url);

    }

    catch (error) {

      check.healthy = false;

      check.message =
        form.formName +
        " : " +
        error.message;

      break;

    };

  }

  Logger.log("Google Forms Check:");

  Logger.log(check);

  return check;

}


function checkTrigger() {

  Logger.log("----------------------------------------");
  Logger.log("Checking Platform Trigger...");
  Logger.log("----------------------------------------");

  const check = {

    name: "Platform Trigger",

    healthy: true,

    message: "Platform heartbeat detected."

  };

  try {

    const lastExecution =
      PropertiesService
        .getScriptProperties()
        .getProperty(
          "LAST_SUCCESSFUL_EXECUTION"
        );

    if (!lastExecution) {

      throw new Error(
        "No platform heartbeat recorded."
      );

    }

    const currentTime =
      new Date();

    const heartbeat =
      new Date(lastExecution);

    const MILLISECONDS_PER_MINUTE = 60000;

    const difference =
      (currentTime - heartbeat) /
        MILLISECONDS_PER_MINUTE;

    const HEARTBEAT_THRESHOLD_MINUTES = 10;

    if (difference > HEARTBEAT_THRESHOLD_MINUTES) {

      throw new Error(
        "No successful execution detected within the last "
        + HEARTBEAT_THRESHOLD_MINUTES +
        " minutes."
      );

    }

  }

  catch (error) {

    check.healthy = false;

    check.message = error.message;

  }

  Logger.log("Platform Trigger Check:");

  Logger.log(check);

  return check;

}


function buildHealthContext(
  report
) {

  Logger.log("----------------------------------------");
  Logger.log("Building Health Context...");
  Logger.log("----------------------------------------");

  // Build Health Context

  const healthContext = {

    status:

      report.healthy
        ? "HEALTHY"
        : "UNHEALTHY",

    report:
      JSON.stringify(
        report,
        null,
        2
      )

  };

  Logger.log("Health Context Built Successfully.");

  return healthContext;

}


function getPlatformServicesStatus() {

  Logger.log("----------------------------------------");
  Logger.log("Checking Platform Services Status...");
  Logger.log("----------------------------------------");

  const platformServicesStatus =

    PropertiesService
      .getScriptProperties()
      .getProperty(
        "PLATFORM_SERVICES_STATUS"
      );

  if (!platformServicesStatus) {

    Logger.log("Platform Services Status not found. Defaulting to HEALTHY.");

    return "HEALTHY";

  }

  Logger.log(
    "Platform Services Status: " +
    platformServicesStatus
  );

  return platformServicesStatus;

}


function setPlatformServicesStatus(
  status
) {

  Logger.log("----------------------------------------");
  Logger.log("Updating Platform Services Status...");
  Logger.log("----------------------------------------");

  PropertiesService
    .getScriptProperties()
    .setProperty(
      "PLATFORM_SERVICES_STATUS",
      status
    );

  Logger.log(
    "Platform Services Status Updated: " +
    status
  );

}