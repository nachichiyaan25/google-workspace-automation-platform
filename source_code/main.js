function main() {

  Logger.log("========================================");
  Logger.log("Atlas Workspace Automation Platform");
  Logger.log("========================================");

  // Process Incoming Emails

  processIncomingEmails();

  // Process Form Responses

  processFormResponses();
  
  
  Logger.log("Workspace Automation Completed Successfully.");

}