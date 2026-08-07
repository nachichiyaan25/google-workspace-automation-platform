function getEmailTemplatesData() {

  // Connect to Configuration Spreadsheet

  const spreadsheet =
    getConfigurationSheet();

  Logger.log("----------------------------------------");
  Logger.log("Loading Email Templates Configuration...");
  Logger.log("----------------------------------------");

  // Load Email Templates Sheet

  const templatesSheet =
    spreadsheet.getSheetByName(
      "02_Email_Templates"
    );

  Logger.log("Email Templates Sheet Loaded Successfully.");

  // Read Configuration Data

  const data =
    templatesSheet
      .getDataRange()
      .getValues();

  Logger.log("Email Templates Configuration Data Loaded Successfully.");

  return data;

}


function transformEmailTemplates(
  data
) {

  Logger.log("----------------------------------------");
  Logger.log("Transforming Email Templates Configuration...");
  Logger.log("----------------------------------------");

  // Remove Header Row

  const rows =
    data.slice(1);

  // Transform Configuration Rows

  const templates = [];

  for (const row of rows) {

    const template = {

      templateName: row[0],

      emailAlias: row[1],

      subject: row[2],

      body: row[3],

      requiredVariables: row[4],

      attachmentGroup: row[5]

    };

    templates.push(template);

  }

  Logger.log("Email Templates Transformation Completed Successfully.");

  return templates;

}


function getEmailTemplateConfiguration(
  templateName
) {

  // Load Email Templates Configuration

  const data =
    getEmailTemplatesData();

  // Transform Configuration Data

  const templates =
    transformEmailTemplates(
      data
    );

  // Find Requested Template

  const template =
    templates.find(
      item =>
        item.templateName === templateName
    );

  Logger.log("Email Template Configuration Fetched Successfully.");

  return template;

}