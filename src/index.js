"use strict";

import * as dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `${__dirname}/.env.${env}` });

Object.defineProperty(exports, "__esModule", { value: true });
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/", licenseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
