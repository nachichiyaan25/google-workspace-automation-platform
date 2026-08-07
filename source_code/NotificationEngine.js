function getNotificationsData() {

  // Load Configuration Spreadsheet

  const spreadsheet =
    getConfigurationSheet();

  // Load Notifications Sheet

  const notificationsSheet =
    spreadsheet.getSheetByName(
      "04_Notifications"
    );

  Logger.log("Notifications Sheet Loaded Successfully.");

  // Read Configuration Data

  const data =
    notificationsSheet
      .getDataRange()
      .getValues();

  Logger.log("Notifications Configuration Data Loaded Successfully.");

  return data;
}


function transformNotifications(
  data
) {

  Logger.log("----------------------------------------");
  Logger.log("Transforming Notification Configuration...");
  Logger.log("----------------------------------------");

  // Skip Header Row

  const rows =
    data.slice(1);

  // Transform Notification Configuration

  const notifications = [];

  for (const row of rows) {

    const notification = {

      event: row[0],

      enabled: String(row[1]).toUpperCase() === "TRUE",

      subjectTemplate: row[2],

      bodyTemplate: row[3],

      notify: row[4],

    };

    notifications.push(notification);

  }

  Logger.log("Notification Transformation Completed Successfully.");

  return notifications;

}


function getNotificationConfiguration(
  event
) {

  // Load Notification Configuration Data

  const data =
    getNotificationsData();

  // Transform Configuration Data

  const notifications =
    transformNotifications(
      data
    );

  // Find Notification Event

  const notification =
    notifications.find(
      item =>
        item.event === event
    );

  Logger.log("Notification Configuration Fetched Successfully.");

  return notification;

}


// TODO:
//
// Platform Health notifications currently
// rely on Gmail.
//
// If Gmail becomes unavailable or its daily
// quota is exhausted, health notifications
// cannot be delivered.
//
// Future Improvement:
// - Introduce a secondary notification
//   channel (Google Chat, Slack, Webhook,
//   SMS, etc.) for platform monitoring.

 
function notify(
  event,
  context
) {

  Logger.log("========================================");
  Logger.log("Preparing Notification...");
  Logger.log("========================================");

  Logger.log(
    "Event: " +
    event
  );

  // Load Notification Configuration

  const notification =
    getNotificationConfiguration(
      event
    );

  // Check Notification Status

  if (
    !shouldNotify(notification)
  ) {

    Logger.log("Notification Skipped.");

    return;

  }

  // Load Notification Recipients

  const recipients =
    getNotificationRecipients(
      event,
      context,
      notification
    );

  // Build Variables

  const variables =
    buildTemplateVariables(
      event,
      context
    );

  // Prepare Email Notification

  const preparedEmail =
    prepareNotification(
      notification,
      variables
    );

  // Delegate Email Delivery

  for (const recipient of recipients) {

    sendEmail(
      preparedEmail,
      recipient
    );

  }

  Logger.log("Notification Delivered Successfully.");

}


function shouldNotify(
  notification
) {

  Logger.log("----------------------------------------");
  Logger.log("Checking Notification Configuration...");
  Logger.log("----------------------------------------");

  // Check Notification Status

  if (!notification.enabled) {

    Logger.log(
      "Notifications are disabled for '" +
      notification.event +
      "'."
    );

    return false;

  }

  Logger.log(
    "Notifications are enabled for '" +
    notification.event +
    "'."
  );

  return true;

}


function getNotificationRecipients(
  event,
  context,
  notification
) {

  Logger.log("----------------------------------------");
  Logger.log("Loading Notification Recipients...");
  Logger.log("----------------------------------------");

  let recipients = [];

  switch (event) {

    case "INCOMING_EMAIL":

      recipients =
        context.alias.notify
          .split(",")
          .map(email => email.trim());

      break;

    case "FORM_SUBMISSION":

      recipients =
        context.form.notify
          .split(",")
          .map(email => email.trim());

      break;

    case "PLATFORM_SERVICES_HEALTHY":

    case "PLATFORM_SERVICES_UNHEALTHY":

    case "EXECUTION_FAILURE":

    case "PLATFORM_RESTORED":

      recipients =
        notification.notify
          .split(",")
          .map(email => email.trim());

      break;

    default:

      throw new Error(

        "Unsupported Notification Event: " +
        event

      );

  }

  Logger.log("Recipients:");

  Logger.log(recipients);

  return recipients;

}


function buildTemplateVariables(
  event,
  context
) {

  Logger.log("----------------------------------------");
  Logger.log("Building Template Variables...");
  Logger.log("----------------------------------------");

  let variables = {};

  switch (event) {

    case "INCOMING_EMAIL":

      variables = {

        aliasName:
          context.alias.displayName,

        senderName:
          context.senderName,

        senderEmail:
          context.senderEmail

      };

      break;

    case "FORM_SUBMISSION":

      variables = {

        formName:
          context.form.formName,

        ...buildRespondentVariables(
          context
        )

      };

      break;

    case "PLATFORM_SERVICES_HEALTHY":

    case "PLATFORM_SERVICES_UNHEALTHY":

      variables = {

        status:
          context.status,

        report:
          context.report

      };

      break;

    case "EXECUTION_FAILURE":

      variables =  {

        timestamp:
          context.timestamp,

        message:
          context.message,

        stack:
          context.stack

      };

      break;

    case "PLATFORM_RESTORED":

      variables = {

        timestamp:
          context.timestamp

      };

      break;

    default:

      throw new Error(

        "Unsupported Notification Event: " +
        event

      );

  }

  Logger.log("Template Variables Built Successfully.");

  return variables;

}



function prepareNotification(
  notification,
  variables
) {

  Logger.log("----------------------------------------");
  Logger.log("Preparing Notification Content...");
  Logger.log("----------------------------------------");

  // Prepare Subject

  const subject =
    replaceVariables(
      notification.subjectTemplate,
      variables
    );

  // Prepare Body

  const body =
    replaceVariables(
      notification.bodyTemplate,
      variables
    );

  // Convert Notification Body to HTML

  const htmlBody =
    convertToHtml(
      body
    );

  Logger.log("Notification Prepared Successfully.");

  return {

    subject,

    body,

    htmlBody

  };

}



