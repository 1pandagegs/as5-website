const { Resend } = require("resend");
const { z } = require("zod");

// Empty form fields arrive as "" — treat them as absent.
const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().max(500).optional()
);

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(200),
  email: z.email("Please enter a valid email address."),
  phone: optionalText,
  company: optionalText,
  inquiryType: optionalText,
  project: optionalText,
  timeline: optionalText,
  message: z.string().trim().min(10, "Please tell us a bit more about your inquiry.").max(5000),
  // Honeypot: hidden from people, filled in by bots.
  website: optionalText,
});

const FROM = process.env.INQUIRY_FROM_EMAIL || "AS5 Group Website <website@as5group.com>";
const TO = process.env.INQUIRY_RECIPIENT_EMAIL || "info@as5group.com";

function parseBody(req) {
  const body = req.body;
  if (body && typeof body === "object") return body;
  if (typeof body !== "string") return {};
  try {
    return JSON.parse(body);
  } catch {
    return Object.fromEntries(new URLSearchParams(body));
  }
}

// The contact form posts JSON via fetch; without JavaScript the browser
// posts the form itself, and gets a redirect/HTML page instead of JSON.
function wantsJson(req) {
  const accept = req.headers.accept || "";
  const type = req.headers["content-type"] || "";
  return accept.includes("application/json") || type.includes("application/json");
}

function respond(req, res, status, payload) {
  if (wantsJson(req)) {
    res.status(status).json(payload);
    return;
  }
  if (status === 200) {
    res.setHeader("Location", "/contact/thank-you/");
    res.status(303).end();
    return;
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(status).send(
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>' +
      '<meta name="viewport" content="width=device-width, initial-scale=1"/>' +
      "<title>Inquiry not sent — AS5 Group</title></head><body>" +
      "<h1>Your inquiry was not sent</h1>" +
      `<p>${status === 400 ? "Please go back and check the form: name, a valid email and a message of at least 10 characters are required." : "Something went wrong on our side."}</p>` +
      '<p>You can also email <a href="mailto:info@as5group.com">info@as5group.com</a> or call <a href="tel:+2347042377442">+234 704 237 7442</a>.</p>' +
      '<p><a href="/contact/">Back to the contact page</a></p></body></html>'
  );
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const parsed = inquirySchema.safeParse(parseBody(req));

  if (!parsed.success) {
    respond(req, res, 400, { error: "Invalid submission.", issues: parsed.error.issues });
    return;
  }

  const { name, email, phone, company, inquiryType, project, timeline, message, website } = parsed.data;

  if (website) {
    // Bot submission: report success so it doesn't retry, send nothing.
    respond(req, res, 200, { success: true });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.startsWith("TODO")) {
    // In production a missing key must surface as an error, otherwise the
    // visitor sees "received" and the inquiry is silently lost.
    if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
      console.error("RESEND_API_KEY is not configured — inquiry could not be delivered.");
      respond(req, res, 503, { error: "Inquiries are temporarily unavailable." });
      return;
    }
    console.warn(
      "RESEND_API_KEY is not configured — inquiry logged instead of sent.",
      { name, email, phone, company, inquiryType, project, timeline, message }
    );
    respond(req, res, 200, { success: true, delivered: false });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New website inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : undefined,
        company ? `Company: ${company}` : undefined,
        inquiryType ? `Inquiry type: ${inquiryType}` : undefined,
        project ? `Project of interest: ${project}` : undefined,
        timeline ? `Estimated timeline: ${timeline}` : undefined,
        "",
        message,
      ]
        .filter((line) => line !== undefined)
        .join("\n"),
    });

    if (error) {
      console.error("Resend rejected the inquiry email.", error);
      respond(req, res, 502, { error: "Failed to send inquiry." });
      return;
    }
  } catch (error) {
    console.error("Sending the inquiry email failed.", error);
    respond(req, res, 502, { error: "Failed to send inquiry." });
    return;
  }

  respond(req, res, 200, { success: true, delivered: true });
};
