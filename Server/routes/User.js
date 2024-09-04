import express, { Router } from 'express';
import yup from 'yup';
import User from '../models/User.js';
import db from '../models/model_index.js';
import { validateToken } from '../middlewares/auth.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
const { sign } = jwt;
dotenv.config();
import { google } from 'googleapis';


const userRouter = express.Router();

userRouter.post('/create', async (req, res) => {
    let data = req.body;
    console.log(data)
    // console.log("potato")

    //yup validation
    let validationSchema = yup.object({
        name: yup.string().required("User Name is required"),
        dob: yup.date()
            .min(new Date(1900, 0, 1), 'Date of birth must be on or after January 1, 1900')
            .max(new Date(), 'Date of birth must be in the past')
            .required('Date of birth is required'),
        sex: yup.string()
            .oneOf(['male', 'female'], 'Invalid sex')
            .required("User Sex is required"),
        residentialStatus: yup.string()
            .oneOf(['Citizen', 'Permanent Resident', 'Foreigner'], 'Invalid residential status')
            .required('Residential status is required'),
        email: yup.string().required("Email is required"),
        mobileNo: yup.string()
            .required('Mobile number is required')
            .test('len', 'Mobile number must be 8 digits', val => val && val.length === 8)
            .test('numeric', 'Mobile number must be numeric', val => val && /^\d+$/.test(val)),
        streetName: yup.string().required('Street Name is required'),
        postal: yup.string()
            .required('Postal code is required')
            .test('len', 'Postal code must be 6 digits', val => val && val.length === 6 && /^\d+$/.test(val)),
        blockNo: yup.string().required('Block Number is required')
            .test('numeric', 'Block Number must be numeric', val => val && /^\d+$/.test(val)),
        floorNo: yup.string(),
        unitNo: yup.string(),
        buildingName: yup.string().optional(),
        password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .test('hasLetter', 'Password must have at least one letter', val => val && /[a-zA-Z]/.test(val))
        .test('hasNumber', 'Password must have at least one number', val => val && /\d/.test(val))
        .test('hasCapitalLetter', 'Password must have at least one capital letter', val => val && /[A-Z]/.test(val))
        .test('hasSpecialSymbol', 'Password must have at least one special symbol', val => val && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
        .notOneOf([yup.ref('currentPassword')], 'New password must not match previous password'),
        staffPosition: yup.string()
            .oneOf(['Manager', 'Staff', 'NonStaff'], 'Invalid Staff Position')
            .required('staff position is required')
    });

    try {
        data = await validationSchema.validate(data, {
            abortEarly: false
        });

        // Check email
        let user = await db.User.findOne({
            where: { email: data.email }
        });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }

        // Hash passowrd
        data.password = await bcrypt.hash(data.password, 10);

        // process validate data
        let result = await db.User.create(data);
        res.json({
            message: `Email ${result.email} was registered successfully.`
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ errors: err.errors });
    }
})

userRouter.post("/login", async (req, res) => {
    let data = req.body;
    // console.log(data);
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await db.User.findOne({
            where: { email: data.email }
        });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        console.log(userInfo)
        let accessToken = sign(userInfo, process.env.APP_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });
    }
    catch (err) {
        // console.log(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
});

userRouter.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    };
    res.json({
        user: userInfo
    });
});


//get all users
userRouter.get('/', async (req, res) => {
    let users = await db.User.findAll();
    res.send(users)
})

//get user by id
userRouter.get('/:id', async (req, res) => {
    let id = req.params.id;
    let users = await db.User.findByPk(id);
    res.send(users);

})

//Update user by id
userRouter.put("/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let num = await db.User.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "User was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update User with id ${id}.`
        });
    }
});


//Delete user by id
userRouter.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await db.User.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "User was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete User with id ${id}.`
        });
    }
});


//nodemailer
const GOOGLE_CLIENT_ID = "99510302633-dt9equslhlbcjp23a4md2n7o64ccpbid.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
const GOOGLE_REFRESH_TOKEN = "1//04knQxPzMQDudCgYIARAAGAQSNwF-L9Ir00cbyii0BDvHJQFB0xmw9Qj7IZ1cItsFqhWl19VxNXXqip9_tmBn9XoR1Jfl8KDb6P8"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const GOOGLE_APP_EMAIL = "spamming256@gmail.com"

const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });


const sendTestEmail = async (mailOptions) => {
    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: GOOGLE_APP_EMAIL,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN,
        },
        tls: {
            rejectUnauthorized: true,
        },
    });

    return new Promise((resolve, reject) => {
        transport.sendMail({ ...mailOptions, from: GOOGLE_APP_EMAIL }, (err, info) => {
            if (err) reject(err);
            resolve(info);
        });
    });
};


userRouter.post('/forgot-password', async (req, res) => {
    const email = req.body.email;
    console.log(email);
    console.log(GOOGLE_APP_EMAIL);

    try {
        const user = await db.User.findOne({ where: { email: email } });
        if (!user) {
            return res.send({ Status: "User does not exist" });
        }

        const passwordResetToken = sign({ userID: user.id }, process.env.PASSWORD_SECRET, {
            expiresIn: process.env.PASSWORDTOKEN_EXPIRES_IN,
        });

        //STORE RESET TOKEN IN USER'S DATA!
        await db.User.update({ passwordRecoveryToken: passwordResetToken }, { where: { id: user.id } });

        const mailOptions = {
            subject: 'Reset Account Password Link',
            to: email,
            html: `
          <h3>Please click the link below to reset your password</h3>
          <p>This reset link will expire in 15 minutes.</p>
          <p>${process.env.CLIENT_URL}/resetpassword/${user.id}/${passwordResetToken}</p>
          `,
        };

        try {
            await sendTestEmail(mailOptions);
            res.send({ Status: "Email has been sent, please follow the instructions" });
            console.log("Email successfully sent!");
        } catch (error) {
            console.log(error);
            res.send({ Status: "Error sending email" });
        }
    } catch (error) {
        console.log(error);
        res.send({ Status: "Error processing request" });
    }
});

userRouter.post('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params
    const { newPassword } = req.body

    try {
        //verifying token
        jwt.verify(token, process.env.PASSWORD_SECRET, async (err, decoded) => {
            if (err) {
                console.log("invalid token");
                return res.status(401).send({ Status: "Invalid or expired token" });
            }
            //finding user to update password
            const user = await db.User.findOne({ where: { id: id } });
            if (!user) {
                console.log("cannot find user");
                return res.status(401).send({ Status: "Invalid token" });
            }
            let hashedPassword; // declare the variable here
            //token valid, update password
            try {
                hashedPassword  = await bcrypt.hash(newPassword, 10);
                // rest of your code here
              } catch (err) {
                console.error(err);
                console.log("Cannot hash password")
                res.status(500).send({ message: 'Error hashing password' });
              }            await db.User.update({ password: hashedPassword , passwordRecoveryToken: null }, { where: { id: id } });
            res.send({ Status: "Successful Reset of Password" })
        });
    } catch {
        res.status(401).send({ Status: "Invalid token" })
    }
})

userRouter.post('/change-password', async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;

    try {
        const user = await db.User.findOne({ where: { id: id } });
        if (!user) {
            return res.send({ Status: "User does not exist" });
        }

        //verification
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.send({Status: "Current password does not match password"})
        }

        //hash new password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        } catch (err) {
            console.error(err);
            return res.status(500).send({message: "Error hashing password"});
        }

        await db.User.update({password: hashedPassword}, {where: {id: id} });
        res.send({Status: "Password changed successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).send({Status: "Error in changing password"});
    }
})

export default userRouter;