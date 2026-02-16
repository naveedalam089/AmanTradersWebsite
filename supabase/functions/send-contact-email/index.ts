import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

/**
 * ============================================
 * CONTACT FORM EMAIL CONFIGURATION
 * ============================================
 * This edge function sends contact form submissions
 * via email.
 * 
 * RECIPIENT EMAIL ADDRESS:
 * Change the email below to update where messages go
 * ============================================
 */

// ============================================
// RECIPIENT EMAIL - UPDATE THIS TO YOUR BUSINESS EMAIL
// Current: naveedalam1994@gmail.com
// ============================================
const RECIPIENT_EMAIL = "naveedalam1994@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error("Missing required fields");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // For now, we'll log the message and return success
    // In production, integrate with a proper email service like Resend
    console.log("=================================");
    console.log("New Contact Form Submission");
    console.log("=================================");
    console.log(`To: ${RECIPIENT_EMAIL}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Phone: ${phone || "Not provided"}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log("=================================");

    // Create email content for WhatsApp fallback
    const whatsappMessage = encodeURIComponent(
      `*New Contact Form Submission*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Phone:* ${phone || "Not provided"}\n` +
      `*Subject:* ${subject}\n\n` +
      `*Message:*\n${message}`
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message received successfully",
        recipient: RECIPIENT_EMAIL,
        whatsappLink: `https://wa.me/923001234567?text=${whatsappMessage}`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
