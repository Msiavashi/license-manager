"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.extractLicenseData = exports.validateLicenseKey = exports.generateLicenseKey = exports.signData = void 0;
var crypto = require("crypto");
var base64 = require("base-64");
var dotenv = require("dotenv");
var env = process.env.NODE_ENV || "development";
var dotenvResult = dotenv.config({ path: __dirname + "/../.env." + env });
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
function signData(data) {
    var _a;
    var privateKey = (_a = process.env.PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.split(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n"], ["\\n"])))).join("\n");
    if (!privateKey) {
        throw new Error("Private key not found in environment variables");
    }
    var sign = crypto.createSign("SHA256");
    sign.update(data);
    return sign.sign(privateKey, "hex");
}
exports.signData = signData;
/**
 * Generates a license key based on the provided parameters.
 *
 * @param {string} product_id - A unique identifier for the software product.
 * @param {string} cpu_id - The CPU ID of the server.
 * @param {number} license_period_days - The license period in days.
 * @returns {string} - The generated license key.
 */
function generateLicenseKey(product_id, cpu_id, license_period_days) {
    var encodedData = base64.encode(cpu_id + ":" + license_period_days);
    var checksum = crypto.createHash("md5").update(encodedData).digest("hex");
    var signature = signData(encodedData + checksum);
    return product_id + "-" + encodedData + "-" + checksum + "-" + signature;
}
exports.generateLicenseKey = generateLicenseKey;
/**
 * Validates a license key.
 *
 * @param {string} license_key - The license key to validate.
 * @returns {boolean} - True if the license key is valid, false otherwise.
 */
function validateLicenseKey(license_key) {
    var _a;
    var _b = license_key.split("-"), product_id = _b[0], encodedData = _b[1], checksum = _b[2], signature = _b[3];
    if (!product_id || !encodedData || !checksum || !signature) {
        return false; // Malformed license key
    }
    var computedChecksum = crypto
        .createHash("md5")
        .update(encodedData)
        .digest("hex");
    if (computedChecksum !== checksum) {
        return false; // Checksum mismatch
    }
    var verify = crypto.createVerify("SHA256");
    verify.update(encodedData + checksum);
    var publicKey = (_a = process.env.PUBLIC_KEY) === null || _a === void 0 ? void 0 : _a.split(String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n"], ["\\n"])))).join("\n");
    if (!publicKey) {
        throw new Error("Public key not found in environment variables");
    }
    return verify.verify(publicKey, signature, "hex"); // Signature verification result
}
exports.validateLicenseKey = validateLicenseKey;
/**
 * Extracts the product_id, cpu_id, and license_period_days from a license key.
 *
 * @param {string} license_key - The license key.
 * @returns {object} - An object containing the product_id, cpu_id, and license_period_days.
 */
function extractLicenseData(license_key) {
    var _a = license_key.split("-"), product_id = _a[0], encodedData = _a[1], checksum = _a[2], signature = _a[3];
    if (!product_id || !encodedData || !checksum || !signature) {
        return null; // Malformed license key
    }
    var decodedData = base64.decode(encodedData);
    var _b = decodedData.split(":"), cpu_id = _b[0], license_period_days_str = _b[1];
    var license_period_days = parseInt(license_period_days_str, 10);
    if (!cpu_id || isNaN(license_period_days)) {
        return null; // Malformed encoded data
    }
    return { product_id: product_id, cpu_id: cpu_id, license_period_days: license_period_days };
}
exports.extractLicenseData = extractLicenseData;
// Example data
var product_id = "MyProduct";
var cpu_id = "abcdef123456";
var license_period_days = 30;
// Generate a license key
var licenseKey = generateLicenseKey(product_id, cpu_id, license_period_days);
console.log(licenseKey);
var data = extractLicenseData(licenseKey);
console.log(data);
console.log(validateLicenseKey(licenseKey));
var templateObject_1, templateObject_2;
