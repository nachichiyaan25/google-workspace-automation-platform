function applyIdentity(
  body,
  identity
) {

  Logger.log("----------------------------------------");
  Logger.log("Applying Organization Identity...");
  Logger.log("----------------------------------------");

  const htmlBody = `

    <div
      style="
        font-family: Arial, sans-serif;
        font-size:14px;
        color:#333333;
        line-height:1.6;
      "
    >

      <p>${body}</p>

      <br>

      <p>

        Regards,

      </p>

      <p
        style="
          margin:0;
          color:${ORGANIZATION.primaryColor};
          font-size:15px;
          font-weight:bold;
        "
      >

        ${identity.displayName}

      </p>

      <img
        src="${ORGANIZATION.logoUrl}"
        width="120"
        style="
          margin-top:15px;
          margin-bottom:15px;
        "
      >

      <p
        style="
          margin:0;
          color:#666666;
          font-size:13px;
        "
      >

        ${identity.email}

      </p>

    </div>

  `;

  Logger.log("Organization Identity Applied Successfully.");

  return htmlBody;

}