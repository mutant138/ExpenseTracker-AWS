function addNewExpense(e){
    e.preventDefault();

    const expenseDetails = {
        expenseamount: e.target.expenseamount.value,
        description: e.target.description.value,
        category: e.target.category.value,

    }
    console.log(expenseDetails)
    const token  = localStorage.getItem('token')
    axios.post('http://localhost:3000/expense/addexpense',expenseDetails,  { headers: {"Authorization" : token} })
        .then((response) => {

        addNewExpensetoUI(response.data.expense);

    }).catch(err => showError(err))

}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "   
    document.getElementById('downloadexpense').style.visibility = "visible"
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', ()=> {
    const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
    }
    axios.get('http://localhost:3000/expense/getexpenses', { headers: {"Authorization" : token} })
    .then(response => {
            response.data.expenses.forEach(expense => {

                addNewExpensetoUI(expense);
            })
    }).catch(err => {
        showError(err)
    })
});

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    const listItem = document.createElement("li");
listItem.id = expenseElemId;
listItem.className = "list-group-item d-flex justify-content-between align-items-center";

// Display expense details
listItem.innerHTML = `
    <span>${expense.expenseamount} - ${expense.category} - ${expense.description}</span>
    <button onclick='deleteExpense(event, ${expense.id})' class="btn btn-danger btn-sm">
        Delete Expense
    </button>
`;

// Append the new list item to the parent element
parentElement.appendChild(listItem);
}

function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`,  { headers: {"Authorization" : token} }).then(() => {
    removeExpensefromUI(expenseid);

    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}
var leaderboardElem = document.getElementById("leaderboard");
console.log(leaderboardElem);
var leaderboardDisplayed = false;

function showLeaderboard() {
  
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.className = "btn btn-primary"; // Bootstrap button classes
  inputElement.style.marginTop = "10px"; 
  
  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    try {
      const userLeaderBoardArray = await axios.get(
        "http://localhost:3000/premium/showLeaderBoard",
        { headers: { Authorization: token } }
      );
      console.log(userLeaderBoardArray.data)

      leaderboardElem.innerHTML = '<h1 class="mt-5">Leader Board</h1>';

      const leaderboardList = document.createElement("ul");
      leaderboardList.className = "list-group";

      userLeaderBoardArray.data.forEach((userDetails) => {
        const listItem = document.createElement("li");
        listItem.className =
          "list-group-item d-flex justify-content-between align-items-center";
          const nameSpan = document.createElement("span");
      nameSpan.textContent = `Username:  ${userDetails.name}`;

      // Create a span for the badge
      const badge = document.createElement("span");
      badge.className = "badge badge-primary badge-pill";
      const totalExpense = parseInt(userDetails.totalExpenses) || 0;
        badge.textContent = `Total Expense - ${totalExpense}`;
      // console.log(parseInt(userDetails.total_expense) || 0);
      listItem.appendChild(nameSpan);
      listItem.appendChild(badge);
      leaderboardList.appendChild(listItem);
      });
      // console.log(leaderboardElem.innerHTML); 
      leaderboardElem.appendChild(leaderboardList);
      leaderboardElem.style.display = "block"; 
    } catch (error) {
      console.error(error);
    }
  };

  if (!leaderboardDisplayed) {
    document.getElementById("message").appendChild(inputElement);
    leaderboardDisplayed = true;
  }
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}

async function download(){
    const token = localStorage.getItem('token')
    console.log(token)
    try {
        const res = await axios.get('http://localhost:3000/user/download', { headers: { Authorization: token } })

    if(res.status === 200){
        var a = document.createElement("a")
        a.href = res.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
    }else{
        console.log(res.data.message)
        throw new Error(res.data.message)
    }
    } catch(error){
        alert(error)
    }  
}