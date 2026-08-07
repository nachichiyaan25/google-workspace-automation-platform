function getAttachmentsData() {

  // Connect to Configuration Spreadsheet

  const spreadsheet =
    getConfigurationSheet();

  Logger.log("----------------------------------------");
  Logger.log("Loading Email Attachments Configuration...");
  Logger.log("----------------------------------------");

  // Load Email Attachments Sheet

  const attachmentsSheet =
    spreadsheet.getSheetByName(
      "07_Email_Attachments"
    );

  Logger.log("Email Attachments Sheet Loaded Successfully.");

  // Read Configuration Data

  const data =
    attachmentsSheet
      .getDataRange()
      .getValues();

  Logger.log("Email Attachments Configuration Data Loaded Successfully.");

  return data;

}


function transformAttachments(
  data
) {

  Logger.log("----------------------------------------");
  Logger.log("Transforming Email Attachments Configuration...");
  Logger.log("----------------------------------------");

  // Remove Header Row

  const rows =
    data.slice(1);

  // Transform Configuration Rows

  const attachments = [];

  for (const row of rows) {

    const attachment = {

      attachmentGroup: row[0],

      fileName: row[1],

      driveLink: row[2]

    };

    attachments.push(
      attachment
    );

  }

  Logger.log("Email Attachments Transformation Completed Successfully.");

  return attachments;

}


function getAttachmentConfigurations(
  attachmentGroup
) {

  // Load Email Attachments Configuration

  const data =
    getAttachmentsData();

  // Transform Configuration Data

  const attachments =
    transformAttachments(
      data
    );

  // Find Requested Attachment Configurations

  const attachmentConfigurations =
    attachments.filter(
      item =>
        item.attachmentGroup === attachmentGroup
    );

  Logger.log("Email Attachment Configurations Fetched Successfully.");

  return attachmentConfigurations;

}


function resolveAttachments(
  attachmentConfigurations
) {

  Logger.log("----------------------------------------");
  Logger.log("Resolving Attachments...");
  Logger.log("----------------------------------------");

  // Build Attachment Collection

  const attachments = [];

  for (const attachment of attachmentConfigurations) {

    Logger.log(
      "Resolving Attachment: " +
      attachment.fileName
    );

    // Read Drive File

    const file =
      DriveApp.getFileById(
        getDriveFileId(
          attachment.driveLink
        )
      );

    // Convert Attachment to PDF

    const start =
      new Date();

    const blob =
      file
        .getAs(
          MimeType.PDF
        )
        .setName(
          attachment.fileName +
          ".pdf"
        );

    attachments.push(
      blob
    );

    Logger.log(
      "Resolved '" +
      attachment.fileName +
      "' Successfully."
    );

    Logger.log(
      "PDF Conversion: " +
      (new Date() - start) +
      " ms"
    );

  }

  Logger.log("All Attachments Resolved Successfully.");

  return attachments;

}


function getDriveFileId(
  driveLink
) {

  Logger.log("----------------------------------------");
  Logger.log("Extracting Drive File ID...");
  Logger.log("----------------------------------------");

  // Extract File ID

  const match =
    driveLink.match(
      /\/d\/([^\/]+)\//
    );

  // Validate Drive Link

  if (!match) {

    throw new Error(
      "Invalid Drive Link: " +
      driveLink
    );

  }

  const fileId =
    match[1];

  Logger.log(
    "Drive File ID: " +
    fileId
  );

  Logger.log("Drive File ID Extracted Successfully.");

  return fileId;

}


function getAttachmentGroup(
  template
) {

  Logger.log("----------------------------------------");
  Logger.log("Reading Attachment Group...");
  Logger.log("----------------------------------------");

  // Read Attachment Group

  const attachmentGroup =
    template.attachmentGroup
      .trim();

  Logger.log(
    "Attachment Group: " +
    attachmentGroup
  );

  Logger.log("Attachment Group Read Successfully.");

  return attachmentGroup;

}


function buildAttachments(
  template
) {

  Logger.log("----------------------------------------");
  Logger.log("Building Attachments...");
  Logger.log("----------------------------------------");

  // Read Attachment Group

  const attachmentGroup =
    getAttachmentGroup(
      template
    );

  // Load Attachment Configurations

  const attachmentConfigurations =
    getAttachmentConfigurations(
      attachmentGroup
    );

  // Resolve Attachments

  const attachments =
    resolveAttachments(
      attachmentConfigurations
    );

  Logger.log("Attachments Built Successfully.");
  Logger.log(
    "Attachments Built: " +
    attachments.length
  );

  return attachments;

}