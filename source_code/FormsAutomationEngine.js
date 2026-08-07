function getFormsData() {

  // Connect to Configuration Spreadsheet

  const spreadsheet =
    getConfigurationSheet();

  Logger.log("----------------------------------------");
  Logger.log("Loading Google Forms Configuration...");
  Logger.log("----------------------------------------");

  // Load Google Forms Sheet

  const formsSheet =
    spreadsheet.getSheetByName(
      "03_Google_Forms"
    );

  Logger.log("Google Forms Sheet Loaded Successfully.");

  // Read Configuration Data

  const data =
    formsSheet
      .getDataRange()
      .getValues();

  Logger.log("Google Forms Configuration Data Loaded Successfully.");

  return data;

}


function transformForms(
  data
) {

  Logger.log("----------------------------------------");
  Logger.log("Transforming Google Forms Configuration...");
  Logger.log("----------------------------------------");

  // Remove Header Row

  const rows =
    data.slice(1);

  // Transform Configuration Rows

  const forms = [];

  for (const row of rows) {

    const form = {

      formName: row[0],

      url: row[1],

      qrUrl: row[2],

      acknowledgementSubject: row[3],

      acknowledgementBody: row[4],

      nameField: row[5],

      emailField: row[6],

      aliasEmail: row[7],

      status: row[8],

      notify: row[9],

    };

    forms.push(form);

  }

  Logger.log("Google Forms Transformation Completed Successfully.");

  return forms;

}


function getFormsConfiguration() {

  // Load Google Forms Configuration

  const data =
    getFormsData();

  // Transform Configuration Data

  const forms =
    transformForms(
      data
    );

  return forms;

}


function getFormsContext() {

  Logger.log("----------------------------------------");
  Logger.log("Discovering Google Form Responses...");
  Logger.log("----------------------------------------");

  // Get Forms Configuration

  const forms =
    getFormsConfiguration();

  // Build Form Context

  const formsContext = [];

  for (const form of forms) {

    Logger.log("----------------------------------------");
    Logger.log("Form:");
    Logger.log(form.formName);

    // Open Google Form

    const googleForm =
      openGoogleForm(
        form.url
      );

    // Get Form Responses

    const formResponses =
      googleForm.getResponses();

    Logger.log(
      "Responses Found: " +
      formResponses.length
    );

    if (formResponses.length === 0) {

      Logger.log("No Responses Found.");

      continue;

    }

    // Build Form Context

    for (const formResponse of formResponses) {

      const responseDictionary =
        buildResponseDictionary(
          formResponse
        );

      const formContext = {

        form,

        formResponse,

        responseDictionary

      };

      formsContext.push(
        formContext
      );

    }

  }

  Logger.log("----------------------------------------");
  Logger.log("Google Forms Context Built Successfully.");
  Logger.log("----------------------------------------");

  return formsContext;

}


function buildResponseDictionary(
  formResponse
) {

  // Get Response Items

  const itemResponses =
    formResponse.getItemResponses();

  Logger.log(
    "Questions Found: " + 
    itemResponses.length
  );

  // Build Response Dictionary

  const responseDictionary = {};

  for (const itemResponse of itemResponses) {

    const question =
      itemResponse
        .getItem()
        .getTitle()
        .trim();

    const answer =
      itemResponse
        .getResponse();

    responseDictionary[question] = answer;

  }

  Logger.log("Response Dictionary:")
  Logger.log(responseDictionary)

  return responseDictionary;

}


function buildRespondentVariables(
  formContext
) {

  Logger.log("----------------------------------------");
  Logger.log("Building Respondent Variables...");
  Logger.log("----------------------------------------");

  // Load Form Context

  const form =
    formContext.form;

  const responseDictionary =
    formContext.responseDictionary;

  // Build Respondent Variables

  const variables = {

    responderName:
      responseDictionary[
        form.nameField.trim()
      ],

    responderEmail:
      responseDictionary[
        form.emailField.trim()
      ]

  };

  Logger.log("Respondent Variables Built Successfully." );

  return variables;

}


function getFormConfiguration(
  formName
) {

  // Load Google Forms Configuration

  const data =
    getFormsData();

  // Transform Configuration Data

  const forms =
    transformForms(
      data
    );

  // Find Requested Form

  const form =
    forms.find(
      item =>
       item.formName === formName
    );

  Logger.log("Google Form Configuration Fetched Successfully.");

  return form;

}


function prepareFormSubmissionReply(
  form,
  variables
) {

  Logger.log("----------------------------------------");
  Logger.log("Preparing Form Submission Reply...");
  Logger.log("----------------------------------------");

  // Load Alias Configuration
  
  const alias =
    getEmailAliasConfiguration(
      form.aliasEmail
    );
  
  // Replace Template Variables

  const body =
    replaceVariables(
      form.acknowledgementBody,
      variables
    );

  // Convert Email Body to HTML

  const htmlContent =
    convertToHtml(body);

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

  Logger.log("Form Submission Reply Prepared Successfully.");

  return {

    from: alias.email,

    fromName: alias.displayName,

    subject: form.acknowledgementSubject,

    body,

    htmlBody

  };

}


function processFormResponses() {

  Logger.log("----------------------------------------");
  Logger.log("Processing Form Responses...");
  Logger.log("----------------------------------------");

  // Get Form Contexts

  const formsContext =
    getFormsContext();

  for (const formContext of formsContext) {

    // Build Event ID

    const eventId =
      buildEventId(
        "form",
        formContext.formResponse.getId()
      );

    // Check Processed Event

    if (
      isEventHandled(
        eventId
      )
    ) {

      continue;

    }

    // Build Template Variables

    const variables =
      buildRespondentVariables(
        formContext
      );

    // Check Respondent Email

    const validEmail =
      isValidEmail(
        variables.responderEmail
      );

    // Check Respondent Email

    if (validEmail) {

      // Prepare Reply Email

      const preparedEmail =
        prepareFormSubmissionReply(
          formContext.form,
          variables
        );

      // Send Email

      sendEmail(
        preparedEmail,
        variables.responderEmail
      );

    } else {

      Logger.log(
        "Invalid Respondent Email (" +
        variables.responderEmail +
        ") for form '" +
        formContext.form.formName +
        "'. Skipping Auto Reply."
      );

    }

    // Notify 
    
    notify(
      "FORM_SUBMISSION",
      formContext
    );

    // Log Processed Event

    logProcessedEvent(
      eventId,
      "form",
      formContext.form.formName
    );

  }

  Logger.log("Form Responses Processed Successfully.");

}


  
