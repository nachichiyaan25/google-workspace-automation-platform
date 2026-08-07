function getConfigurationSheet() {

  Logger.log("----------------------------------------");
  Logger.log("Connecting to Configuration Sheet...");
  Logger.log("----------------------------------------");

  const spreadsheet =
    SpreadsheetApp.openById(
      CONFIG.SPREADSHEET_ID
    );

  Logger.log("Configuration Sheet Connected Successfully.");

  return spreadsheet;

}


function getEmailAliasesData() {

  // Connect to Configuration Spreadsheet

  const spreadsheet =
    getConfigurationSheet();

  Logger.log("----------------------------------------");
  Logger.log("Loading Email Aliases Configuration...");
  Logger.log("----------------------------------------");

  // Load Email Aliases Sheet

  const emailAliasesSheet =
    spreadsheet.getSheetByName(
      "01_Email_Aliases"
    );

  Logger.log("Email Aliases Sheet Loaded Successfully.");

  // Read Configuration Data

  const data =
    emailAliasesSheet
      .getDataRange()
      .getValues();

  Logger.log("Email Aliases Configuration Data Loaded Successfully.");

  return data;

}


function transformEmailAliases(
  data
) {

  Logger.log("----------------------------------------");
  Logger.log("Transforming Email Aliases Configuration...");
  Logger.log("----------------------------------------");

  // Remove Header Row

  const rows =
    data.slice(1);

  // Transform Configuration Rows

  const aliases = [];

  for (const row of rows) {

    const alias = {

      email: row[0],

      displayName: row[1],

      status: row[2],

      department: row[3],

      template: row[4],

      formName: row[5],

      notify: row[6],

      autoReply: row[7],

      priority: row[8]

    };

    aliases.push(alias);

  }

  Logger.log("Email Aliases Transformation Completed Successfully.");

  return aliases;

}


function getEmailAliasConfiguration(
  emailAddress
) {

  // Load Email Aliases Configuration

  const data =
    getEmailAliasesData();

  // Transform Configuration Data

  const aliases =
    transformEmailAliases(
      data
    );

  // Find Requested Alias

  const alias =
    aliases.find(
      item =>
        item.email === emailAddress
    );

  Logger.log("Email Alias Configuration Fetched Successfully.");

  return alias;

}


function getEmailAliasesConfiguration() {

  // Load Email Aliases Configuration

  const data =
    getEmailAliasesData();

  // Transform Configuration Data

  const aliases =
    transformEmailAliases(
      data
    );

  Logger.log("Email Aliases Configuration Fetched Successfully.");

  return aliases;

}