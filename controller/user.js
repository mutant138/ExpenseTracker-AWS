const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function isStringInvalid(string) {
  return string === undefined || string.length === 0;
}

const signupPage = async (req, res) => {
  //console.log("SignupPage")
  res.sendFile('signup.html', { root: 'public/views' });
};
const loginPage = async (req, res) => {
  //console.log("loginPage")
  res.sendFile('login.html', { root: 'public/views' });
};
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //console.log({ name, email, password })

    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ err: "Bad parameters. Something is missing" });
    }
    const saltrounds = 10;
    bcrypt.hash(password,saltrounds,async (err,hash)=>{
      //console.log(err)
      await User.create({ name, email, password: hash })
      res.status(200).json({ message: "Signup successful" })
    })
    // Create the user  
  }catch(err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
 
const login = async (req,res)=>{
  try{
  const { email,password } = req.body;
  console.log(`Login details ${password}`)
  if(isStringInvalid(email) || isStringInvalid(password)){
    return res.status(400).json({success: false, message: `Email and password is missing`})
  }
  const user = await User.findAll( {where : {email}})
    if(user.length>0){
      bcrypt.compare(password,user[0].password, (err,response)=>{
        if(err){
         throw new Error(`Something went wrong`)
        }
        if(response){
          res.status(200).json({success: true, message:`User Logged in succesfully`, token: generateAccessToken(user[0].id, user[0].name,user[0].ispremiumuser)})
        }else{
          return res.status(400).json({success: false, message: `Password is incorrect`})
        }
      }) 
    }else{
      return res.status(400).json({success: false, message: `User not found`})
    }
  }catch(err){
    res.status(400).json({message: err,success: false})
  }
}

function generateAccessToken(id,name,ispremiumuser){ 
  return jwt.sign({userId: id , name:name, ispremiumuser },'secretkeyformyproject1380')
}

module.exports = {
  signupPage,
  signup,
  loginPage,
  login,
  generateAccessToken
};
