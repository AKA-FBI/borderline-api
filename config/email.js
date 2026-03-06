const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send notification when new enquiry is received
const sendEnquiryNotification = async (enquiry) => {
  try {
    await transporter.sendMail({
      from: `"Borderline Innovations" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Enquiry from ${enquiry.name}`,
      html: `
        <h2>New Student Enquiry</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${enquiry.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${enquiry.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${enquiry.phone || "Not provided"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Destination:</td><td style="padding: 8px;">${enquiry.country || "Not specified"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Study Level:</td><td style="padding: 8px;">${enquiry.level || "Not specified"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${enquiry.message || "No message"}</td></tr>
        </table>
        <p style="margin-top: 20px; color: #666;">Submitted on ${new Date(enquiry.createdAt).toLocaleString()}</p>
      `,
    });
    console.log(`Notification email sent for enquiry from ${enquiry.name}`);
  } catch (error) {
    console.error("Email notification failed:", error.message);
  }
};

// Send confirmation to the student
const sendEnquiryConfirmation = async (enquiry) => {
  try {
    await transporter.sendMail({
      from: `"Borderline Innovations" <${process.env.SMTP_USER}>`,
      to: enquiry.email,
      subject: "We've received your enquiry — Borderline Innovations",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #07103d; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0;">Borderline Innovations</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #07103d;">Hi ${enquiry.name},</h2>
            <p style="color: #555; line-height: 1.7;">
              Thank you for reaching out to Borderline Innovations! We've received your enquiry and our team will review it within 24 hours.
            </p>
            <p style="color: #555; line-height: 1.7;">
              In the meantime, feel free to chat with us on WhatsApp for a quicker response.
            </p>
            <a href="https://wa.me/2348000000000" style="display: inline-block; background: #25D366; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Chat on WhatsApp</a>
            <p style="color: #999; font-size: 13px; margin-top: 32px;">— The Borderline Innovations Team</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Confirmation email failed:", error.message);
  }
};

// Send welcome email to new subscriber
const sendSubscriberWelcome = async (email) => {
  try {
    await transporter.sendMail({
      from: `"Borderline Innovations" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Borderline Innovations Newsletter!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #07103d; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome!</h1>
          </div>
          <div style="padding: 32px;">
            <p style="color: #555; line-height: 1.7;">
              You've been subscribed to the Borderline Innovations newsletter. You'll receive updates on scholarships, events, and study abroad tips.
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 32px;">— The Borderline Innovations Team</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Subscriber welcome email failed:", error.message);
  }
};

module.exports = { sendEnquiryNotification, sendEnquiryConfirmation, sendSubscriberWelcome };
