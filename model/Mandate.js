const mongoose = require("mongoose");

// Utility regex for decimal validation
const decimalRegex = /^\d+(\.\d{1,2})?$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const MandateSchema = new mongoose.Schema(
  {
    // --- Request fields ---
    MsgId: { type: String, required: true, unique: true },
    Customer_Name: { type: String, required: true },
    Customer_Mobile: { type: String },
    Customer_TelphoneNo: { type: String },
    Customer_EmailId: { type: String },
    Customer_AccountNo: { type: String, required: true },
    Short_Code: { type: String, required: true },
    UtilCode: { type: String, required: true },

    // Dates
    Customer_StartDate: {
      type: String,
      required: true,
      validate: {
        validator: (v) => dateRegex.test(v),
        message: (props) => `${props.value} is not a valid date (YYYY-MM-DD)`,
      },
    },
    Customer_ExpiryDate: {
      type: String,
      validate: {
        validator: (v) => !v || dateRegex.test(v),
        message: (props) => `${props.value} is not a valid date (YYYY-MM-DD)`,
      },
    },

    // Amounts
    Customer_DebitAmount: {
      type: String,
      validate: {
        validator: (v) => !v || decimalRegex.test(v),
        message: (props) => `${props.value} is not a valid decimal`,
      },
    },
    Customer_MaxAmount: {
      type: String,
      validate: {
        validator: (v) => !v || decimalRegex.test(v),
        message: (props) => `${props.value} is not a valid decimal`,
      },
    },

    Customer_DebitFrequency: { type: String },
    Customer_SequenceType: {
      type: String,
      enum: ["RCUR", "OOFF"],
      required: true,
    },
    Customer_InstructedMemberId: { type: String, required: true },

    Merchant_Category_Code: { type: String, required: true },
    Channel: {
      type: String,
      enum: ["Debit", "Net", "Aadhaar"],
      required: true,
    },

    // Fillers
    Filler1: { type: String, default: "" },
    Filler2: { type: String, default: "" },
    Filler3: { type: String, default: "" },
    Filler4: { type: String, default: "" },
    Filler5: { type: String, enum: ["S", "C", "O"], required: true },
    Filler6: { type: String, default: "" },
    Filler7: { type: String, default: "" },
    Filler8: { type: String, default: "" },
    Filler9: { type: String, default: "" },
    Filler10: { type: String, default: "" },

    Customer_Reference1: { type: String, default: "" },
    Customer_Reference2: { type: String, default: "" },

    CheckSum: { type: String, required: true }, // CheckSum

    // --- Response fields from Bank/NPCI ---
    HDFC_Response: { type: Object },// store MandateRespDoc
 
  },
  { timestamps: true }
);

// Pre-save validation
MandateSchema.pre("save", function (next) {
  if (
    !this.Customer_Mobile &&
    !this.Customer_TelphoneNo &&
    !this.Customer_EmailId
  ) {
    return next(
      new Error(
        "Either Customer_Mobile, Customer_TelphoneNo, or Customer_EmailId must be provided"
      )
    );
  }

  if (!this.Customer_DebitAmount && !this.Customer_MaxAmount) {
    return next(
      new Error("Either Customer_DebitAmount or Customer_MaxAmount must be provided")
    );
  }

  if (this.Customer_SequenceType === "RCUR" && !this.Customer_DebitFrequency) {
    return next(
      new Error("Customer_DebitFrequency is required for RCUR mandates")
    );
  }

  if (this.Customer_SequenceType === "OOFF") {
    this.Customer_DebitFrequency = "";
  }

  next();
});

module.exports = mongoose.model("Mandate", MandateSchema);
