const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mainRouter = require("./routes/index");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1 * 60 * 1000 // 1 minute in milliseconds
        }
    })
)
app.use("/api/v1", mainRouter);

app.listen(PORT, () => {  
    console.log(`Server is running on PORT ${PORT}`)
})