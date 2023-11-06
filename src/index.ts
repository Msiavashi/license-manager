import * as dotenv from "dotenv";
import express from "express";
import licenseRouter from "./licenseAPI";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `${__dirname}/.env.${env}` });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/", licenseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
