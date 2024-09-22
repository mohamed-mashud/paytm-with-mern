const express = require("express");
const router = express.Router();
const {Account} = require("../db");
const {authMiddleware} = require("../middleware");
const { default: mongoose } = require("mongoose");
router.use(authMiddleware);

router.get("/balance", async(req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
})

router.post("/transfer", async(req, res) => {
    const session = await mongoose.startSession();
    // mongoDb session which goes gud with acid properties

    session.startTransaction();
    const amount = req.body.amount;
    const reciever = req.body.reciever;

    const account = await Account.findOne({
        userId: req.userId
    })

    if(!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg : "need more than that to transfer"
        })
    }

    const recieverAccount = await Account.findOne({userId: reciever}).session(session);

    if(!recieverAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg : "reciever not found ,  who r u trying to send the money to "
        })
    }

    // take the money
    await Account.updateOne({userId: req.userId}, {
        $inc: {
            balance: -amount
        }
    }).session(session);

    //give the money
    await Account.updateOne({userId: reciever}, {
        $inc: {
            balance: amount
        }
    }).session(session);

    // commit the transaction
    await session.commitTransaction();
    res.json({
        msg: "money transfered successfully"
    })
})
module.exports = router;