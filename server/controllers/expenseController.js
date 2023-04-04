const { User, Expense, sequelize } = require("../models/expense");

const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, "mySecretKey", {
      expiresIn: "5000s",
    });
  };
  const getUserDetails= async (req, res) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the token and decode the user details
      const decoded = jwt.verify(token, 'mySecretKey');
  
      // Find the user based on the decoded user ID
      const user = await User.findOne({
        where: {
          id: decoded.id
        },
        attributes: ['id', 'email', 'username']
      });
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
const createUser=async (req,res)=>{
  try {
      const {username,email, password }=req.body;
      const salt=await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user=await User.create({username,email,password:hashedPassword});
      const token=generateAccessToken(user);
     // res.status(201).json({ id: user.id, email: user.email, username: user.username, token})
     res.status(201).json({token});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
  }
}
 const loginUser= async (req, res)=> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(400).json({ error: "Invalid email or password" });
      } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
          const token = generateAccessToken(user);
          //res.json({ id: user.id, email: user.email, username: user.username, token });
          res.status(201).json({token});
        } else {
          res.status(400).json({ error: "Invalid email or password" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }

  const  getAllUsers=async(req, res)=> {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  } 

  ///  expense 

  const addExpense=async (req,res)=>{
    try {
        const { amount, description ,date,category} = req.body;
        //const userId = req.userId;
        const token = req.headers.authorization.split(' ')[1];
  
        // Verify the token and decode the user details
        const decoded = jwt.verify(token, 'mySecretKey');
        const userId=decoded.id;
       // const userId = req.params.userId;
         // Create a new expense and associate it with the user
         const expense=await Expense.create({ amount, description ,date,category,userId});
         res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
  }

  

      
  const getExpensesByUser=async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
  
        // Verify the token and decode the user details
        const decoded = jwt.verify(token, 'mySecretKey');
        const userId=decoded.id;
        const user=await User.findOne({where:{id:userId}});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
         // Find all expenses for the user
         const expense=await Expense.findAll({where:{userId}});
         res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
  }

 // const { User, Expense, sequelize } = require("../models/expense");

const DeleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token and decode the user details
    const decoded = jwt.verify(token, "mySecretKey");
    const userId = decoded.id;

    // Find the expense by ID and check if it belongs to the user
    const expense = await Expense.findOne({
      where: {
        id: expenseId,
        userId: userId,
      },
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Delete the expense
    await expense.destroy();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports={createUser,loginUser,getUserDetails,getAllUsers,addExpense,getExpensesByUser,DeleteExpense};
