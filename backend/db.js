const mongoose = require("mongoose");
mongoose.connect(MONGODB_URL);

const userSchema = new mongoose.Schema({
    username:  {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    }
});

const Account = mongoose.model("account", accountSchema);
const User = mongoose.model("User", userSchema);
module.exports = {
    User,
    Account
}