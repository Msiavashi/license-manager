# Express License Management Project

This is a simple Express.js-based project for license management. It provides two main endpoints to generate and validate license keys for a product. The project is written in TypeScript and uses the Express.js framework.

## Installation

Before running the project, make sure you have Node.js and npm (Node Package Manager) installed on your machine.

1. Clone this repository to your local machine:

   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```bash
   cd express-license-management
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Development

For development, you can use the following npm script to start the server with automatic reloading when you make changes to the code:

```bash
npm run dev
```

## Usage

### Generate License Key

To generate a license key, make a GET request to the following endpoint:

```
GET /generate-license
```

Query Parameters:

- `product_id` (string, required): The ID of the product for which you want to generate a license key.
- `cpu_id` (string, required): The CPU ID associated with the product.
- `license_period_days` (string, required): The number of days the license should be valid.

Example Request:

```
GET /generate-license?product_id=example_product&cpu_id=12345&license_period_days=365
```

Example Response:

```json
{
  "license_key": "your_generated_license_key_here"
}
```

### Validate License Key

To validate a license key, make a POST request to the following endpoint:

```
POST /validate-license
```

Request Body:

- `license_key` (string, required): The license key you want to validate.

Example Request:

```json
POST /validate-license
Content-Type: application/json

{
  "license_key": "your_license_key_here"
}
```

Example Response:

```json
{
  "isValid": true,
  "license_data": {
    "product_id": "MyProduct",
    "cpu_id": "123",
    "license_period_days": 365
  }
}
```

If the `isValid` field is `true`, the license key is valid, and you will also receive `license_data` containing information about the product, CPU ID, and the number of days the license is valid.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Feel free to customize and extend this project to suit your specific licensing needs.

## License Utility Module

This project also includes a standalone utility module for license-related operations. You can use this module independently of the project in other applications that require license generation, validation, or data extraction functionality.

### Functions in the License Utility Module

| Function Name         | Purpose                                                    | Can Be Used Independently? |
|-----------------------|------------------------------------------------------------|-----------------------------|
| `signData(data)`      | Signs data using a private key.                            | Yes                         |
| `generateLicenseKey(product_id, cpu_id, license_period_days)` | Generates a license key based on provided parameters.  | Yes                         |
| `validateLicenseKey(license_key)` | Validates a license key.                         | Yes                         |
| `extractLicenseData(license_key)` | Extracts product_id, cpu_id, and license_period_days from a license key. | Yes |

This module contains functions for various license-related operations, making it a standalone utility that can be used independently of the main project.