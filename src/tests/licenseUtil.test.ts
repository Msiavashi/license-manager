import {
  generateLicenseKey,
  validateLicenseKey,
  extractLicenseData,
} from "../licenseUtil";

describe("License Utility Module", () => {
  let product_id: string;
  let cpu_id: string;
  let license_period_days: number;

  beforeAll(() => {
    // Initialize test data
    product_id = "XYZ123";
    cpu_id = "cpu-abc-123";
    license_period_days = 365;
  });

    test("generateLicenseKey function", () => {
      const licenseKey = generateLicenseKey(
        product_id,
        cpu_id,
        license_period_days
      );
      expect(licenseKey).toBeTruthy();
      expect(licenseKey.split("-").length).toBe(4); // License key should have 4 parts separated by '-'
    });

    test("validateLicenseKey function", () => {
      const licenseKey = generateLicenseKey(
        product_id,
        cpu_id,
        license_period_days
      );
      const isValid = validateLicenseKey(licenseKey);
      expect(isValid).toBe(true); // License key should be valid

      // Create a malformed license key and test validation
      const malformedLicenseKey = licenseKey.replace("-", ":");
      const isMalformedValid = validateLicenseKey(malformedLicenseKey);
      expect(isMalformedValid).toBe(false); // Malformed license key should be invalid
    });

    test("extractLicenseData function", () => {
      const licenseKey = generateLicenseKey(
        product_id,
        cpu_id,
        license_period_days
      );
      const extractedData = extractLicenseData(licenseKey);
      expect(extractedData).not.toBeNull();
      expect(extractedData).toEqual({
        product_id,
        cpu_id,
        license_period_days,
      });

      // Test with a malformed license key
      const malformedLicenseKey = licenseKey.replace("-", ":");
      const malformedExtractedData = extractLicenseData(malformedLicenseKey);
      expect(malformedExtractedData).toBeNull();
    });
});
