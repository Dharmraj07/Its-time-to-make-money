const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expenseRouter=require('./routes/expenseRoutes');
const cors = require("cors");
const Razorpay=require('razorpay');
const { User, Expense } = require("./models/expense");


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/',expenseRouter);
app.post("/payment", async (req, res) => {
    const instance = new Razorpay({
        key_id: 'rzp_test_udprcQrS4WF5M2',
        key_secret: 'TL0klGSEi3vJ5LpLCku0AvZl'
    });

    const { amount } = req.body;

    try {
        const order = await instance.orders.create({
            amount: amount * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        });

        res.status(201).json({
            success: true,
            order,
            amount
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Payment failed"
        });
    }
});




app.listen(8000,()=>{
    console.log("port is listening on 8000");
})
