function getRequiredVariables(
  template
) {

  Logger.log("----------------------------------------");
  Logger.log("Reading Required Variables...");
  Logger.log("----------------------------------------");

  // Read Variables String

  const variableString =
    template.requiredVariables;

  // Split Variable Names

  const variables =
    variableString.split(",");

  // Remove Extra Spaces & Empty Values

  const requiredVariables = [];

  for (const variable of variables) {

    const variableName =
      variable.trim();

    if (variableName !== "") {

      requiredVariables.push(
        variableName
      );

    }

  }

  Logger.log("Required Variables:");
  Logger.log(requiredVariables);

  Logger.log("Required Variables Read Successfully.");

  return requiredVariables;

}


function resolveVariable(
  variableName,
  context
) {

  Logger.log("----------------------------------------");
  Logger.log(
    "Resolving Variable: " +
    variableName
  );
  Logger.log("----------------------------------------");

  let value;

  switch (variableName) {

    case "name":

      value = context.senderName;

      break;

    case "formLink":

      value = context.form.url;

      break;

    default:

      throw new Error(
        "Unknown Variable: " +
        variableName
      );

  }

  Logger.log(
    "Resolved '" +
    variableName +
    "' = " +
    value
  );

  return value;

}


function buildVariables(
  context,
  template
) {

  Logger.log("----------------------------------------");
  Logger.log("Building Variables...");
  Logger.log("----------------------------------------");

  // Read Required Variables

  const requiredVariables =
    getRequiredVariables(
      template
    );

  // Build Template Variables

  const variables = {};

  for (const variableName of requiredVariables) {

    variables[variableName] =
      resolveVariable(
        variableName,
        context
      );

  }

  Logger.log("Variables Built Successfully.");
  Logger.log("Variables:");
  Logger.log(variables);

  return variables;

}