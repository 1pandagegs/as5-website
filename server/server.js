require("dotenv").config();

const express = require("express");
const path = require("node:path");
const { Resend } = require("resend");
const { z } = require("zod");

const app = express();
const PORT = process.env.PORT || 4000;
const staticRoot = path.join(__dirname, "..");

const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().optional(),
  project: z.string().optional(),
  message: z.string().min(10, "Please tell us a bit more about your inquiry."),
});

app.use(express.json());
app.use(express.static(staticRoot, { extensions: ["html"] }));

app.post("/api/inquire", async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid submission.", issues: parsed.error.issues });
  }

  const { name, email, phone, project, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.startsWith("TODO")) {
    console.warn(
      "RESEND_API_KEY is not configured — inquiry logged instead of sent.",
      { name, email, phone, project, message }
    );
    return res.json({ success: true, delivered: false });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "AS5 Inquiries <inquiries@as5.example>",
    to: process.env.INQUIRY_RECIPIENT_EMAIL || "inquiries@as5.example",
    replyTo: email,
    subject: `New inquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : undefined,
      project ? `Project of interest: ${project}` : undefined,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    return res.status(502).json({ error: "Failed to send inquiry." });
  }

  return res.json({ success: true, delivered: true });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(staticRoot, "404.html"));
});

app.listen(PORT, () => {
  console.log(`AS5 static site running at http://localhost:${PORT}`);
});
