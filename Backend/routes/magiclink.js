import express from "express";
import sendMagicLinkEmail from "../utils/sendEmail.js";
const router = express.Router();

router.post("/send-magic-link", async (req,res) => {
    const {email} = req.body;

    if(!email) {
        return res.status(400).json({error: "Email is required"});
    }

    const result = await sendMagicLinkEmail(email);

if(result.success){
    res.status(200).json({message: result.message});
} else{
    res.status(500).json({error: result.message});
}
    
});



export default router;