const { Sequelize, DataTypes } = require("sequelize");

const sequelize=new Sequelize('tree','root','#@Dharm007',{
    host:'localhost',
    dialect:'mysql'
});

const User=sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username: {
        type:DataTypes.STRING,
        allowNull:false
    },
    email: {
         type:DataTypes.STRING,
         allowNull:false,
         unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

const Expense = sequelize.define('expense', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      }
  });

  User.hasMany(Expense,{foreignKey:'userId'})
Expense.belongsTo(User);

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((error) => {
    console.error('Unable to synchronize the models:', error);
  });

module.exports = {
  sequelize,Expense,User
};