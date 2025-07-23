import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { extractStructuredData } from "./llm-extractor";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post(
  "/api/upload",
  upload.single("pdf"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }

      const parsed = await pdfParse(req.file.buffer);
      const text = parsed.text;

      const structuredData = await extractStructuredData(text);
      res.json(structuredData);
    } catch (err: any) {
      console.error("Extraction error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.listen(port, () => {
  console.log(`🧠 PDF Extractor running on port ${port}`);
});
