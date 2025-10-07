
const Mandate = require("../model/Mandate");
const { encryptAES, generateChecksum } = require("../utils/crypto");


exports.initiateMandate = async (req, res) => {
  try {
    const formData = req.body;
    const msgId = "SUV" + Date.now();
    console.log("Generated MsgId:", msgId);
      formData.Short_Code = "SUVICO";
    formData.UtilCode = "NACH00000000000020";
    // Format amounts
    const debitAmountStr = formData.Customer_DebitAmount
      ? parseFloat(formData.Customer_DebitAmount).toFixed(2)
      : "0.00";
    const maxAmountStr = formData.Customer_MaxAmount
      ? parseFloat(formData.Customer_MaxAmount).toFixed(2)
      : "";

    const checksum = generateChecksum(
      formData.Customer_AccountNo,
      formData.Customer_StartDate,
      formData.Customer_ExpiryDate,
      formData.Customer_DebitAmount,
      formData.Customer_MaxAmount
    );

//  --- Save original (plain) data ---


    // Build payload to send to HDFC
    const payload = {
      ...formData,
      MsgId: msgId,
      Customer_Name: encryptAES(formData.Customer_Name),
      Customer_Mobile: encryptAES(formData.Customer_Mobile),
      Customer_EmailId: encryptAES(formData.Customer_EmailId),
      Customer_AccountNo: encryptAES(formData.Customer_AccountNo),
      Short_Code: encryptAES("SUVICO"),
      UtilCode: encryptAES("NACH00000000000020"),
      Customer_Reference1: encryptAES(formData.Customer_Reference1),
      Customer_Reference2: encryptAES(formData.Customer_Reference2),
      Customer_DebitAmount: debitAmountStr,
      Customer_MaxAmount: maxAmountStr,
      CheckSum: checksum,
    };

      const mandate = await Mandate.create({
      ...payload,
      originalData: {
        ...formData
      },
    });

      console.log("✅ Mandate saved:", mandate.MsgId);
    // Send auto-submit HTML
    const hdfcUrl = "https://emandateut.hdfcbank.com/Emandate.aspx";
    const inputs = Object.entries(payload)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}"/>`)
      .join("\n");

    const html = `
      <html>
        <body onload="document.forms[0].submit()">
          <form method="POST" action="${hdfcUrl}">
            ${inputs}
          </form>
          <p>Redirecting to bank...</p>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("Error in initiateMandate:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Callback endpoint for HDFC/NPCI
exports.mandateCallback = async (req, res) => {
  try {

    const { CheckSumVal, MandateRespDoc } = req.body;

     console.log("🔹 Raw callback body:", req.body);
    if (!MandateRespDoc) {
      console.error("No MandateRespDoc found in callback");
      return res.status(400).json({ error: "Invalid callback" });
    }

    let mandateResponse = MandateRespDoc;
    if (typeof mandateResponse === "string") {
      try {
        mandateResponse = JSON.parse(mandateResponse.replace(/'/g, '"'));
      } catch (e) {
        console.error("Error parsing MandateRespDoc:", e);
        // Respond with parse error once and exit
        return res.status(400).json({ error: "Invalid MandateRespDoc format" });
      }
    }
    console.log("Callback received MandateRespDoc:", mandateResponse);

    // Save to DB
    const savedMandate = await Mandate.findOneAndUpdate(
      { MsgId: mandateResponse.MsgId },
      {
        $set: {
          Status: mandateResponse.Status,
          RefId: mandateResponse.RefId,
          Errors: mandateResponse.Errors || [],
          HDFC_Response: mandateResponse,
          CheckSumVal
        }
      },
      { new: true }
    );

    if (!savedMandate) {
      console.warn(
        "⚠️ No matching mandate found to update for MsgId:",
        mandateResponse.MsgId
      );
    } else {
      console.log("✅ Mandate updated in DB:", savedMandate.MsgId);
    }

  res.send(`
 <html>
  <head>
    <title>Mandate Status</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .success {
        color: green;
      }
      .failed {
        color: red;
      }
      ul {
        margin-top: 10px;
      }
      button {
        padding: 12px 24px;           /* Larger padding for small screens */
        font-size: 16px;              /* Bigger text */
        width: 100%;                  /* Full width on small screens */
        max-width: 300px;             /* Limit width on larger screens */
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: block;
        margin-top: 20px;
      }
      button:hover {
        background-color: #0056b3;
      }
      @media (min-width: 500px) {
        button {
          width: auto; /* Auto width on larger screens */
        }
      }
    </style>
  </head>
  <body>
    <h2>Mandate Status</h2>

    <p>
      Status:
      <strong class="${mandateResponse.Status === 'Success' ? 'success' : 'failed'}">
        ${mandateResponse.Status}
      </strong>
    </p>
    <p>MsgId: ${mandateResponse.MsgId}</p>
    <p>RefId: ${mandateResponse.RefId}</p>

    ${
      mandateResponse.Status !== 'Success' &&
      mandateResponse.Errors &&
      mandateResponse.Errors.length > 0
        ? `
        <h4>Errors:</h4>
        <ul>
          ${mandateResponse.Errors.map(
            err => `<li>${err.Error_Code} - ${err.Error_Message}</li>`
          ).join('')}
        </ul>
        `
        : ''
    }

    <p>Kindly keep a screenshot and save MsgId for future reference.</p>

    <button onclick="window.location.href='https://suvicosolutions.com/'">
      Go to Home
    </button>
  </body>
</html>

`);


  } catch (err) {
    console.error("Error handling HDFC callback:", err);
    // Make sure only one response is sent in catch
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};

// Optional: check mandate status
exports.getMandateStatus = async (req, res) => {
  try {
    const mandate = await Mandate.findOne({ MsgId: req.params.msgId });
    if (!mandate) return res.status(404).json({ status: "Not found" });
    res.json({ response: mandate.HDFC_Response || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error", error: err.message });
  }
};
