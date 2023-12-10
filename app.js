// Import necessary modules
const express = require('express');
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./util/database'); 

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')


const User = require('./models/user');
const Expense = require('./models/expense');
const { HasMany } = require('sequelize');
dotenv.config();              // Configure environment variables
const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Use your user routes
app.use('/user', userRoutes);
app.use('/expense',expenseRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
