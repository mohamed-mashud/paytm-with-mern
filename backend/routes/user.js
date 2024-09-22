const express = require("express");
const { User, Account } = require("../db")
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const zod = require("zod");
// const bcyrpt = require("bcrypt");

const updateBody = zod.object({
    password:  zod.string().optional(),
    firstName: zod.string().optional(),
    lastName:  zod.string().optional()
})


router.post("/signin", async (req, res)=> { 
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({username, password});
    // const passwordMatch = await bcyrpt.compare(password, isUserExists.password);

    //isUserexists may conntains nothings
    if(!user) {
        return res.status(411).json({
            msg: "user doesnt exist // password wrong"
        })
    }
    req.session.user = {
        id: user._id,
        username: user.username,
    }
    const userId = user._id;
    console.log(userId);
    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    
    res.send({
        userToken : token
    });
})

router.post("/signup", async (req, res) => {
    const isUserExists = await User.findOne({
        username: req.body.username
    });
    
    if(isUserExists) {
        res.status(411).json({
            msg : "user already exists"
        })
        return;
    }
    // const hashedPassword = await bcyrpt.hash(password, 10);
    
    
    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName, 
        password: req.body.password
    })
    
    const userId = user._id;
    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000
    })
    
    req.session.user = {
        id: user._id,
        username: user.username,
    }
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        msg: "user created successfullly",
        token: token
    })
})

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.json({
            msg: "not logged out successfully"
        })
    })
    res.redirect("/signin");
    return; 
})

router.put("/", authMiddleware, async (req, res) => {
    const success = updateBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            msg: "not in the correct format"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        msg: "updated successsfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;