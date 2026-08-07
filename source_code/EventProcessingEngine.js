function getProcessedEventsSheet() {

  // Connect to Configuration Spreadsheet

  const spreadsheet =
    getConfigurationSheet();

  Logger.log("----------------------------------------");
  Logger.log("Loading Processed Events...");
  Logger.log("----------------------------------------");

  // Load Processed Events Sheet

  const processedEventsSheet =
    spreadsheet.getSheetByName(
      "06_Processed_Events"
    );

  Logger.log("Processed Events Sheet Loaded Successfully.");

  return processedEventsSheet;

}


function getProcessedEventsData() {

  // Load Processed Events Sheet

  const processedEventsSheet =
    getProcessedEventsSheet();

  // Read Processed Events Data

  const data =
    processedEventsSheet
      .getDataRange()
      .getValues();

  Logger.log("Processed Events Loaded Successfully.");

  return data;

}


function buildEventId(
  service,
  nativeId
) {

  return `${service}_${nativeId}`;

}


function isEventHandled(
  eventId
) {

  Logger.log("----------------------------------------");
  Logger.log("Checking Processed Events...");
  Logger.log("----------------------------------------");

  // Load Processed Events

  const data =
    getProcessedEventsData();

  // Remove Header Row

  const rows =
    data.slice(1);

  // Check Processed Event

  for (const row of rows) {

    if (
      row[0] === eventId
    ) {

      Logger.log("Event Already Handled.");

      return true;

    }

  }

  Logger.log("New Event Detected.");

  return false;

}


function logProcessedEvent(
  eventId,
  service,
  eventName
) {

  Logger.log("----------------------------------------");
  Logger.log("Logging Processed Event...");
  Logger.log("----------------------------------------");

  // Load Processed Events Sheet

  const processedEventsSheet =
    getProcessedEventsSheet();

  // Record Processed Event

  processedEventsSheet.appendRow([

    eventId,

    service,

    eventName,

    new Date()

  ]);

  Logger.log(
    "Processed Event Logged Successfully."
  );

}