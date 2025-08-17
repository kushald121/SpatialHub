import nodemailer from "nodemailer";
import supabase from "../config/Supabaseclient.js";
import dotenv from "dotenv";

dotenv.config();

const sendMagicLinkEmail = async (email) => {

    try {
        // 1) Generate Magic Link
        const { data, error } = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: process.env.REDIRECT_URL
            },
        });

        console.log("Supabase generateLink response:", { data, error });

        if (error) {
            console.error("Supabase error object:", error);
            throw error;
        }

        const magicLink = data?.properties?.action_link;
        if (!magicLink) {
            console.error("Magic link not generated. Supabase data:", data);
            throw new Error("Magic link not generated.");
        }

        // 2) Create transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // 3) Send Email
        await transporter.verify();
        console.log("SMTP Connected successfully");

        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Login Link for SpatialHub",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Login to My Website</h2>
                <p>Click the link below to log in:</p>
                <a href="${magicLink}" 
                    style="display:inline-block; padding:10px 20px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
                    Login Now
                </a>
                <p style="margin-top:20px; font-size:0.9em; color:gray;">
                    This link will expire soon. If you didn’t request it, please ignore.
                </p>
                </div>
            `,
        });

        console.log("Email sent succesfully");
        console.log(`Message ID: ${info.messageId}`);
        return { success: true, message: "Magic Link sent successfully" };

    } catch (error) {
        console.log("❌ Error sending magic link email");
        console.error("Full error object:", error);
        return { success: false, message: error.message, errorObject: error };
    }
};




export default sendMagicLinkEmail;

