import express from "express";
import {
  generateLicenseKey,
  validateLicenseKey,
  extractLicenseData,
} from "./licenseUtil";

const router = express.Router();

router.get("/generate-license", (req, res) => {
  const product_id = req.query.product_id as string;
  const cpu_id = req.query.cpu_id as string;
  const license_period_days_str = req.query.license_period_days as string;

  if (!product_id || !cpu_id || !license_period_days_str) {
    return res
      .status(400)
      .send(
        "Missing required query parameters: product_id, cpu_id, license_period_days"
      );
  }

  const license_period_days = parseInt(license_period_days_str, 10);

  if (isNaN(license_period_days)) {
    return res.status(400).send("Invalid license_period_days value");
  }

  const license_key = generateLicenseKey(
    product_id,
    cpu_id,
    license_period_days
  );
  res.json({ license_key });
});

router.post("/validate-license", (req, res) => {
  const { license_key } = req.body;

  if (!license_key) {
    return res.status(400).send("Missing required body parameter: license_key");
  }

  const isValid = validateLicenseKey(license_key);
  const license_data = isValid ? extractLicenseData(license_key) : null;
  res.json({ isValid, license_data });
});

export default router;
