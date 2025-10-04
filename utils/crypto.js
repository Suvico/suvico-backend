const crypto = require("crypto");

const AES_KEY = Buffer.from(process.env.AES_KEY || "k2hLr4X0ozNyZByj5DT66edtCEee1x+6", "utf8");

// Encrypt sensitive fields
function encryptAES(text) {
  if (!text) return "";
  const cipher = crypto.createCipheriv("aes-256-ecb", AES_KEY, null);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return "\\x" + encrypted;
}

// Decrypt if needed
function decryptAES(hexStr) {
  if (!hexStr) return "";
  let hex = hexStr.startsWith("\\x") ? hexStr.slice(2) : hexStr;
  const decipher = crypto.createDecipheriv("aes-256-ecb", AES_KEY, null);
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(hex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Generate SHA256 checksum with decimal formatting
function generateChecksum(acctNo, startDate, expiryDate, debitAmount, maxAmount) {
  // Ensure amounts are decimal strings with 2 digits
  const debitStr = debitAmount ? parseFloat(debitAmount).toFixed(2) : "";
  const maxStr = maxAmount ? parseFloat(maxAmount).toFixed(2) : "";

  const data = [acctNo, startDate, expiryDate || "", debitStr, maxStr].join("|");
  return crypto.createHash("sha256").update(data).digest("hex");
}


module.exports = { encryptAES, decryptAES, generateChecksum };
