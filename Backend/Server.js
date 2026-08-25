const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const cors = require('cors');
const cookieParser = require("cookie-parser");
const CryptoJS = require("crypto-js");
const sendOtp = require('./sendotp.js');

app.use(cookieParser());
app.use(express.json());


// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,
// }));

app.use(cors({
    origin: "https://epic-passmanager.vercel.app",
    credentials: true
}));




// // Connection URL
// const client = new MongoClient(process.env.Mongo_URI);
// // Database Name

// const dbName = 'PassManager';
// const db = client.db(dbName);

// const collection = db.collection('passwords');

// async function main() {
//     // Use connect method to connect to the server
//     await client.connect();
//     console.log('Connected successfully to server');
//     return 'done.';
// }

// main()
//     .then(console.log)
//     .catch(console.error)



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.Mongo_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const dbName = 'Epic_PassManager';
const db = client.db(dbName);

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("Epic_PassManager").command({ ping: 1 });
        await db.command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


// .finally(() => client.close());


//  console.log(req.cookies.LoggedUser );
// const Loggeduser = req.cookies.LoggedUser || req.headers.authorization.split(' ')[1];
// console.log(Loggeduser );


// const findResult = await collection.find({}).toArray();
// res.json(findResult)
// console.log('Found documents =>', findResult); 

//Middleware to verify the token 
const auth = async (req, res, next) => {

    // const authHeader = req.headers.authorization;

    // if (!authHeader) {
    //     return res.status(401).json({ message: "No Token Provided " })
    // }
    // const token = authHeader.split(" ")[1];

    //Here By using cookies 

    // const token = req.cookies.Token || req.headers.authorization?.split(' ')[1];
    const token = req.cookies.Token;
    // console.log("Token from cookies => ", token);
    // console.log("Cookies =", req.cookies);
    // console.log("Headers =", req.headers.cookie);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized ' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_Jwt);
        // console.log("Decoded Token :", decoded);

        req.user = decoded;

        next();
    } catch (err) {
        console.log("JWT Error:", err.message);
        return res.status(401).json({
            message: "Invalid token"
        });

    }
};


// const LoggeduserID = req.headers.loggeduserid; 
app.get('/ShowPasswords', auth, async (req, res) => {
    
    await client.connect();
    const collection = db.collection('passwords');
    const passwords = await collection.find({ userId: new ObjectId(req.user._id) }).toArray();
    res.json(passwords);

    // const decrypted = passwords.map(item => {
    //     const bytes = CryptoJS.AES.decrypt(
    //         item.password,
    //         process.env.PASSWORD_SECRET
    //     );
    //     return {
    //         ...item, password: bytes.toString(CryptoJS.enc.Utf8)
    //     }
    // });
    // res.json(decrypted);
});


app.get('/password/:id/reveal', auth, async (req, res) => {
    const id = req.params.id;
    await client.connect();

    const collection = db.collection('passwords');
    const data = await collection.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(req.user._id)

    });

    const decryptedPass = CryptoJS.AES.decrypt(
        data.password,
        process.env.PASSWORD_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (!decryptedPass) {
        return res.status(500).json({
            message: "Unable to decrypt password"
        });
    }
    res.status(200).json({
        password: decryptedPass
    });

})


app.post('/add_password', auth, async (req, res) => {

    // const LoggeduserID = req.headers.loggeduserid;  No Need As Auth Middleware is here
    // console.log("The user Logged Id :\n\n",LoggeduserID);
    // console.log(req.headers);
    // console.log("ADD REQUEST BODY =", req.body);

    await client.connect();

    const collection = db.collection('passwords');
    const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();

    const insertResult = await collection.insertOne({
        userId: new ObjectId(req.user._id),
        site: req.body.site,
        name: req.body.name,
        password: encryptedPassword
    });

    console.log('Added Successfully Inserted documents =>', insertResult);

    res.json({ ...req.body, _id: insertResult.insertedId });

});

app.delete('/del_password/:id', auth, async (req, res) => {
    await client.connect();
    const collection = db.collection('passwords');
    const id = req.params.id;
    console.log("(Deleted Successfully)ID To Delete =>", id);
    const deleted = await collection.findOneAndDelete({
        _id: new ObjectId(id),
        userId: new ObjectId(req.user._id)
    });
    res.json(deleted);
});


app.delete('/RESET', auth, async (req, res) => {
   await client.connect();

    const collection = db.collection('passwords');
    console.log("Reset Successfull (User Id) :", req.user._id);
    const del = await collection.deleteMany({ userId: new ObjectId(req.user._id) });
    res.json(del);

})

app.put('/edit_password/:id', auth, async (req, res) => {
    await client.connect();
    const collection = db.collection('passwords');
    const id = req.params.id;
    // console.log(req.body)
    // const { _id, ...updateData } = req.body;
    // const updated = await collection.findOneAndUpdate(
    //     { _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });

    const encrypted = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET).toString();

    const updated = await collection.findOneAndUpdate(
        {
            _id: new ObjectId(id),
            userId: new ObjectId(req.user._id)
        },
        { $set: { site: req.body.site, name: req.body.name, password: encrypted } },
        { returnDocument: 'after' }
    );

    const decrypted = CryptoJS.AES.decrypt(
        updated.password,
        process.env.PASSWORD_SECRET
    ).toString(CryptoJS.enc.Utf8);

    updated.password = decrypted;

    res.json(updated);
    console.log("Edit Successfuly (Id) =>", id);
    // console.log(" Edit SuccessFullyUpdated :", updated);

});

app.post('/register', async (req, res) => {

    const { password, name, email } = req.body;
    //First Connect to Users Collection In DB
    const collection = db.collection('Users');
    await client.connect();


    const isUserAlreadyExist = await collection.findOne({ email });

    if (isUserAlreadyExist && isUserAlreadyExist.verified) {
        return res.status(409).json({ message: 'This EMAIL Already Exists !!!' })
    }

    const hashedPass = await bcrypt.hash(password, 10);
    // console.log("Converted into ->", hashedPass);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    console.log("Registration OTP Generated :", otp);

    if (isUserAlreadyExist && !isUserAlreadyExist.verified) {
        // return res.status(409).json({ message: "Email already registered."   });
        //This is the Case When A User Uses Same Email To Register But That is'nt Verified
        await collection.findOneAndUpdate({ email }, {
            $set: {
                name,
                password: hashedPass,
                verified: false,
                Otp: otp,
                OtpExpires: expiresAt,
                Otp_Purpose: "register",
                resendAllowedAt: new Date(Date.now() + 30000)
            }
        }, { returnDocument: 'after' }
        );
        return res.status(200).json({ message: "OTP Sent Successfully" });
    }

    const val = await collection.insertOne({
        name, email,
        password: hashedPass,
        verified: false,
        Otp: otp,
        OtpExpires: expiresAt,
        Otp_Purpose: "register",
        resendAllowedAt: new Date(Date.now() + 30000),  //for 30 seconds
        createdAt: new Date()
    });

    const token = jwt.sign({ _id: val._id }, process.env.SECRET_Jwt, { expiresIn: '24h' })
    console.log("User Registered Successfully:", val);
    res.json({ user: val, token });

    sendOtp(email, otp)
        .then(() => console.log("Registration OTP Sent"))
        .catch(err => console.error("Failed to send Sent Registration OTP:", err));

});



app.post('/Login', async (req, res) => {

    const { email, password } = req.body;

    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });
    console.log(user);
    if (!user) {
        console.log("This User Does'nt Exists")
        return res.status(404).json({ message: " This User Does'nt Exists" })
    }
    const Matching = await bcrypt.compare(password, user.password);
    if (!Matching) {
        console.log("Incorrect Password");
        return res.status(401).json({ message: "Incorrect Password" })
    }

    if (!user.verified) {
        return res.status(403).json({
            message: "Please verify your email before logging in."
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    console.log("Login OTP Generated :", otp);

    await collection.updateOne({ _id: user._id }, {
        $set: {
            Otp: otp,
            OtpExpires: expiresAt,
            Otp_Purpose: "login",
            resendAllowedAt: new Date(Date.now() + 30000)  //for 30 seconds
        }
    });
    //res.json line must be here for immediate Redirextion of user to verify OTP page after sending OTP to user email
    res.json({ message: "OTP sent successfully" });

    //    console.time("Send OTP");
    // await sendOtp(email, otp); Do'nt use this after sending the response
    // console.timeEnd("Send OTP");
    sendOtp(email, otp)
        .then(() => console.log("OTP Sent"))
        .catch(err => console.error("Failed to send resent OTP:", err));


});



app.post('/verify-Login', async (req, res) => {

    await client.connect();

    const collection = db.collection('Users');

    const { email } = req.body;

    // console.log("Fetch to /verify-Login Request Hiting properly")

    const user = await collection.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.Otp !== req.body.otp) {
        return res.status(401).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.OtpExpires) {
        return res.status(401).json({ message: "OTP Expired" });
    }
    // After successful verification
    // Always remove the OTP so it cannot be reused:
    await collection.findOneAndUpdate({ _id: user._id }, {
        $unset: {
            Otp: "",
            OtpExpires: "",
            Otp_Purpose: "",
            resendAllowedAt: ""
        }
    }, { returnDocument: 'after' });

    // Generate a new token for the user after successful OTP verification
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_Jwt, { expiresIn: '24h' })
    console.log("Token  :", token);

    res.cookie("Token", token, {
        httpOnly: true,
        secure: false,      // true when using HTTPS in production
        sameSite: "lax",    // or "none" if frontend/backend are on different domains over HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    console.log("Logged In Successfully", user)
    res.status(200).json({ message: "Logged In Successfully", user });

})

app.post('/resend-otp', async (req, res) => {

    await client.connect();
    const collection = db.collection('Users');


    const { email } = req.body;
    const user = await collection.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "If the Account exists, an OTP has been sent." });
    }


    console.log("Now:", new Date());
    console.log("Allowed:", user.resendAllowedAt);
    console.log("Blocked:", new Date() < user.resendAllowedAt);

    if (user.resendAllowedAt && new Date() < user.resendAllowedAt) {

        const secondsLeft = Math.ceil(
            (user.resendAllowedAt - new Date()) / 1000
        );
        return res.status(429).json({
            message: `Please wait ${secondsLeft} seconds before requesting another OTP.`,
            secondsLeft
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    console.log("OTP Generated :", otp);

    await collection.updateOne({ _id: user._id }, {
        $set: {
            Otp: otp,
            OtpExpires: expiresAt,
            Otp_Purpose: "login",
            resendAllowedAt: new Date(Date.now() + 30000) //for 30 seconds
        }
    });

    res.json({ message: "OTP Resent successfully" });

    sendOtp(email, otp)
        .then(() => console.log("OTP Resent"))
        .catch(err => console.error("Failed to send resent OTP:", err));

});


app.post('/verify-register', async (req, res) => {

    await client.connect();
    const collection = db.collection('Users');


    const { email } = req.body;
    // console.log("Email :", email);
    const user = await collection.findOne({ email });
    // console.log("User :", user);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user && !user.verified) {
        await collection.findOneAndUpdate({ _id: user._id }, {
            $set: {
                verified: true
            },
            $unset: {
                Otp: "",
                OtpExpires: "",
                Otp_Purpose: "",
                resendAllowedAt: ""

            }
        }, { returnDocument: 'after' }
        );

        return res.status(200).json({ message: "User Already Registered But Now Verified Successfully", user: user });
    }

    if (user.Otp !== req.body.otp) {
        return res.status(401).json({ message: "Invalid OTP" });
    }
    if (new Date() > user.OtpExpires) {
        return res.status(401).json({ message: "OTP Expired" });
    }

    await collection.findOneAndUpdate({ _id: user._id },
        {
            $set: {
                verified: true
            },
            $unset: {
                Otp: "",
                OtpExpires: "",
                Otp_Purpose: "",
                resendAllowedAt: ""
            }
        }, { returnDocument: 'after' }
    );
    res.status(200).json({ message: "User Verified Successfully & is registered Now", user: user });

});


app.get('/Profile', auth, async (req, res) => {

    // const dbName = 'PassManager';  this i used in Local-MongoDB
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('Users');
    const USER = await collection.findOne({
        _id: new ObjectId(req.user._id)
    })

    res.json(USER);
})

app.get('/LogOut', auth, async (req, res) => {
    
    res.clearCookie('Token');
    res.status(200).json({ message: 'User Logged Out Successfully' });
    console.log('User Logged Out Successfully');

})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
