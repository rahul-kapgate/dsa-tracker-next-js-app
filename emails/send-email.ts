// src/emails/send-email.ts

import { resend } from "@/configs/resend";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams) {
  const { data, error } = await resend.emails.send({
    from: "DSA Tracker <onboarding@stackfromscratch.in>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend Error:", error);

    throw new Error(
      error.message || "Failed to send email"
    );
  }

  if (!data?.id) {
    throw new Error("Email was not accepted by Resend");
  }

  return data;
}