const Expense = require('../models/expense');
const User = require('../models/user'); 
const sequelize = require('../util/database')

const indexPage = async (req, res) => {
    console.log("indexPage")
    res.sendFile('index.html', { root: 'public/views' });
  };

  const addexpense =async (req, res) => {
    const t = await sequelize.transaction()
    const { expenseamount, description, category } = req.body;

    if(expenseamount == undefined || expenseamount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    try {
        const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id },{transaction: t});
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);

        await User.update({ totalExpenses: totalExpense }, {
            where: { id: req.user.id },
            transaction: t
        });
        await t.commit()
        return res.status(201).json({ expense, success: true });
    } catch(err) {
        await t.rollback()
        return res.status(500).json({ success: false, error: err });
    }
}

const getexpenses = (req, res)=> {
    //req.user.getExpenses
    Expense.findAll({where : {userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

const deleteExpense = async (req,res)=>{
   const expenseid = req.params.expenseid
   if(expenseid === undefined || expenseid.length ===0 ){
    return res.status(400).json({ success: false})
   }
   console.log(expenseid)
   try {
    // Retrieve the expense amount before deleting
    const expense = await Expense.findByPk(expenseid);
    const expenseAmount = expense.expenseamount;

    // Delete the expense
    const noOfRows = await Expense.destroy({ where: { id: expenseid, userId: req.user.id } });

    if (noOfRows === 0) {
        return res.status(404).json({ success: false, message: 'Expense doesn\'t belong to the user' });
    }

    // Deduct the deleted expense amount from user's totalExpense
    const updatedTotalExpense = Number(req.user.totalExpenses) - Number(expenseAmount);
    
    // Update the user's totalExpense
    await User.update({ totalExpenses: updatedTotalExpense }, { where: { id: req.user.id } });

    return res.status(200).json({ success: true, message: 'Deleted Successfully' });
   }catch(err){
   console.log(err)
   return res.status(403).json({ success: false, message: 'Failed'})
   }
}


module.exports = {
    indexPage,
    addexpense,
    getexpenses,
    deleteExpense
}