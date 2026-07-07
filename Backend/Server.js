const express = require('express');
const app = express();
const port = 4000;
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const cors = require('cors');
const cookieParser = require("cookie-parser");
const CryptoJS = require("crypto-js");


app.use(cookieParser());
app.use(express.json());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));



const SECRET = 'Pass_Manager_secret_key';
// Connection URL
const client = new MongoClient(process.env.Mongo_URI);
// Database Name
const dbName = 'PassManager';
const db = client.db(dbName);
const collection = db.collection('passwords');

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');

    // the following code examples can be pasted here...

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
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
        const decoded = jwt.verify(token, SECRET);
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
    const passwords = await collection.find({ userId: new ObjectId(req.user._id) }).toArray();

    const decrypted = passwords.map(item => {

        const bytes = CryptoJS.AES.decrypt(
            item.password,
            process.env.PASSWORD_SECRET
        );

        return {
            ...item, password: bytes.toString(CryptoJS.enc.Utf8)
        }

    });

    res.json(decrypted);

});
// console.log(passwords);


//     const Loggeduser = req.cookies.LoggedUser || req.headers.authorization.split(' ')[1];
//    console.log("Check cookie :",Loggeduser );


// console.log(req.headers);
// console.log(req.body);
app.post('/add_password', auth, async (req, res) => {

    // const LoggeduserID = req.headers.loggeduserid;  No Need As Auth Middleware is here
    // console.log("The user Logged Id :\n\n",LoggeduserID);

    // console.log(req.headers);

    // console.log("ADD REQUEST BODY =", req.body);
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
    // await client.connect();
    const id = req.params.id;
    console.log("(Deleted Successfully)ID To Delete =>", id);
    const deleted = await collection.findOneAndDelete({ _id: new ObjectId(id) });
    res.json(deleted);
});


app.delete('/RESET', auth, async (req, res) => {

    console.log("Reset Successfull (User Id) :", req.user._id);
    const del = await collection.deleteMany({ userId: new ObjectId(req.user._id) });
    res.json(del);

})

app.put('/edit_password/:id', auth, async (req, res) => {
    // await client.connect();
    const id = req.params.id;
    // console.log(req.body)
    // const { _id, ...updateData } = req.body;
    // const updated = await collection.findOneAndUpdate(
    //     { _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });

    const encrypted = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET).toString();

    const updated = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { site: req.body.site, name: req.body.name, password: encrypted } },
        { returnDocument: 'after' });

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
    const dbName = 'PassManager';
    const db = client.db(dbName);
    const collection = db.collection('Users');
    await client.connect();


    const isUserAlreadyExist = await collection.findOne({ email });
    if (isUserAlreadyExist) {
        return res.status(409).json({ message: 'This EMAIL Already Exists !!!' })
    }

    const hashedPass = await bcrypt.hash(password, 10);
    // console.log("Converted into ->", hashedPass);
    const val = await collection.insertOne({ name, email, password: hashedPass });

    const token = jwt.sign({ _id: val._id }, SECRET, { expiresIn: '24h' })
    console.log("User Registered Successfully:", val);
    res.json({ user: val, token });
})

app.post('/Login', async (req, res) => {
    const { email, password } = req.body;
    const dbName = 'PassManager';
    const db = client.db(dbName);
    const collection = db.collection('Users');
    await client.connect();

    const user = await collection.findOne({ email });
    // console.log(user);
    if (!user) {
        return res.status(404).json({ message: " This User Does'nt Exists" })
        console.log("This User Does'nt Exists")
    }
    const Matching = await bcrypt.compare(password, user.password);
    if (!Matching) {
        return res.status(401).json({ message: "Incorrect Password" })
        console.log("Incorrect Password");
    }

    const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '24h' })
    // console.log("Token  :",token );

    // res.cookie('Token', token);
    res.cookie("Token", token, {
        httpOnly: true,
        secure: false,      // true when using HTTPS in production
        sameSite: "lax",    // or "none" if frontend/backend are on different domains over HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    // res.cookie("LoggedUser", JSON.stringify(user));
    console.log("Logged In Successfully", user)
    res.status(200).json({ message: "Logged In Successfully", user });


})

app.get('/Profile', auth, async (req, res) => {

    const dbName = 'PassManager';
    const db = client.db(dbName);
    const collection = db.collection('Users');
    await client.connect();
    const USER = await collection.findOne({
        _id: new ObjectId(req.user._id)
    })

    res.json(USER);
})

app.get('/LogOut', auth, async (req, res) => {

    res.clearCookie('Token');
    res.status(200).json({ message: 'User Logged Out Successfully' });
    console.log('User Logged Out Successfull');

})


app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
});