const express = require("express");
const { createUser, loginUser, getUserDetails, getAllUsers, addExpense, getExpensesByUser, DeleteExpense } = require("../controllers/expenseController");

const router=express.Router();
router.post('/signin',loginUser);
router.get('/user',getUserDetails);
router.post('/signup',createUser);
router.post('/expense',addExpense);
router.get('/expense',getExpensesByUser);
router.delete("/expense/:expenseId", DeleteExpense);


router.get('/allusers',getAllUsers);

module.exports = router;
