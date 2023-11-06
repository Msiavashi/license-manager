import * as crypto from "crypto";
import * as base64 from "base-64";
import * as dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
const dotenvResult = dotenv.config({ path: `${__dirname}/../.env.${env}` });

if (dotenvResult.error) {
  console.error("Error loading .env file:", dotenvResult.error);
  process.exit(1);
}

/**
 * Signs data using a private key.
 *
 * @param {string} data - The data to be signed.
 * @returns {string} - The signature.
 */
function signData(data: string): string {
  const privateKey = process.env.PRIVATE_KEY?.split(String.raw`\n`).join("\n");
  if (!privateKey) {
    throw new Error("Private key not found in environment variables");
  }

  const sign = crypto.createSign("SHA256");
  sign.update(data);
  return sign.sign(privateKey, "hex");
}

/**
 * Generates a license key based on the provided parameters.
 *
 * @param {string} product_id - A unique identifier for the software product.
 * @param {string} cpu_id - The CPU ID of the server.
 * @param {number} license_period_days - The license period in days.
 * @returns {string} - The generated license key.
 */
function generateLicenseKey(
  product_id: string,
  cpu_id: string,
  license_period_days: number
): string {
  const encodedData = base64.encode(`${cpu_id}:${license_period_days}`);
  const checksum = crypto.createHash("md5").update(encodedData).digest("hex");
  const signature = signData(encodedData + checksum);

  return `${product_id}-${encodedData}-${checksum}-${signature}`;
}

/**
 * Validates a license key.
 *
 * @param {string} license_key - The license key to validate.
 * @returns {boolean} - True if the license key is valid, false otherwise.
 */
function validateLicenseKey(license_key: string): boolean {
  const [product_id, encodedData, checksum, signature] = license_key.split("-");
  if (!product_id || !encodedData || !checksum || !signature) {
    return false; // Malformed license key
  }

  const computedChecksum = crypto
    .createHash("md5")
    .update(encodedData)
    .digest("hex");
  if (computedChecksum !== checksum) {
    return false; // Checksum mismatch
  }

  const verify = crypto.createVerify("SHA256");
  verify.update(encodedData + checksum);
  const publicKey = process.env.PUBLIC_KEY?.split(String.raw`\n`).join("\n");
  if (!publicKey) {
    throw new Error("Public key not found in environment variables");
  }

  return verify.verify(publicKey, signature, "hex"); // Signature verification result
}

/**
 * Extracts the product_id, cpu_id, and license_period_days from a license key.
 *
 * @param {string} license_key - The license key.
 * @returns {object} - An object containing the product_id, cpu_id, and license_period_days.
 */
function extractLicenseData(
  license_key: string
): { product_id: string; cpu_id: string; license_period_days: number } | null {
  const [product_id, encodedData, checksum, signature] = license_key.split("-");
  if (!product_id || !encodedData || !checksum || !signature) {
    return null; // Malformed license key
  }
  const decodedData = base64.decode(encodedData);
  const [cpu_id, license_period_days_str] = decodedData.split(":");
  const license_period_days = parseInt(license_period_days_str, 10);

  if (!cpu_id || isNaN(license_period_days)) {
    return null; // Malformed encoded data
  }

  return { product_id, cpu_id, license_period_days };
}

export { signData, generateLicenseKey, validateLicenseKey, extractLicenseData };
