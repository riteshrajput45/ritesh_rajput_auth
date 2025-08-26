const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({

    service:"gmail",
    auth:{
        user:"mrriteshrajput045@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD || "Ritesh@gmail.com"
    }

});


exports.sendResetEmail = async(to,link)=>{
    await transporter.sendMail({
        from:'mrriteshrajput045@gmail.com',
        to,
        subject:"Password Reset Request",
        html:`<p>Click <a href = "${link}">here</a> to reset your password. This link is valid for 5 minutes.</p>`
    })
};