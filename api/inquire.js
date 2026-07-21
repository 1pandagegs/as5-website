const { Resend } = require("resend");
const { z } = require("zod");

const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().optional(),
  project: z.string().optional(),
  message: z.string().min(10, "Please tell us a bit more about your inquiry."),
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const parsed = inquirySchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid submission.", issues: parsed.error.issues });
    return;
  }

  const { name, email, phone, project, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.startsWith("TODO")) {
    console.warn(
      "RESEND_API_KEY is not configured — inquiry logged instead of sent.",
      { name, email, phone, project, message }
    );
    res.status(200).json({ success: true, delivered: false });
    return;
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
    res.status(502).json({ error: "Failed to send inquiry." });
    return;
  }

  res.status(200).json({ success: true, delivered: true });
};
