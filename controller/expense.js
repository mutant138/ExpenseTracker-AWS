const Expense = require('../models/expense');

const indexPage = async (req, res) => {
    console.log("indexPage")
    res.sendFile('index.html', { root: 'public/views' });
  };

const addexpense = (req, res) => {
    const { expenseamount, description, category } = req.body;

    if(expenseamount == undefined || expenseamount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
    Expense.create({ expenseamount, description, category, userId:req.user.id}).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(500).json({success : false, error: err})
    })
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

const deleteExpense = (req,res)=>{
   const expenseid = req.params.expenseid
   if(expenseid === undefined || expenseid.length ===0 ){
    return res.status(400).json({ success: false})
   }
   //console.log(expenseid)
   Expense.destroy({where: {id: expenseid, userId: req.user.id}}).then((noofrows)=>{
    if(noofrows ===0){
        return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
    }
    return res.status(200).json({success : true, message : "Deleted Successful"})
   }).catch(err=>{
   console.log(err)
   return res.status(403).json({ success: true, message: 'Failed'})
   })
}


module.exports = {
    indexPage,
    addexpense,
    getexpenses,
    deleteExpense
}