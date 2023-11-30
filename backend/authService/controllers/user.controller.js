const User = require("../models/user.model").User;
const bcrypt = require("bcrypt");
const jwt = require('../util/jwtAuth')
var crypto = require("crypto");
const cookieParser = require('cookie-parser');


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const userRegistration = async (req, res) => {
  try {
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    console.log("user value:", user);
    if (!user) {
      const hash = bcrypt.hashSync(req.body.password, salt);
      const userDetail = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });

      console.log(userDetail);

      await userDetail
        .save()
        .then((data) => {
          console.log("Account Created Successfully", data);
          res.send({ msg: "Registered successfully" });
        })
        .catch((err) => console.log(err));
    } else {
      res.send({ msg: "User already exists" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

const userLogin = async (req, res) => {
  try {
    console.log(req.body)
    const hash = bcrypt.hashSync(req.body.password, salt)
    let user = await User.findOne({
      email: req.body.email,
    });
    console.log(user)
    const verified = bcrypt.compareSync(req.body.password, user.password);
    console.log(verified)

    if(verified){
        token = jwt.jwtTokenGenerator(req.body.email)
        console.log(token)
        res.cookie('token', token, {httpOnly: true});
        res.send({ msg: "Login Successful", token: token })
    }else{
        res.send({ msg: "Wrong Credential" })
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

const checkUserLoginStatus = async (req,res) =>{
  try{
    const token = req.cookies.token
    const verify = jwt.jwtTokenVerify(token)
    console.log(verify)
    if(verify){
      res.send({ msg: "Verified"})
    }else{
      res.send({ msg: "Not Verified"})
    }
  }catch(err){
    console.error(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
}

const forgetPassword = async (req, res) => {
  try{
    let user = await User.findOneAndUpdate({
      email: req.body.email
    },{
      password: bcrypt.hashSync(req.body.password, salt)
    });
    console.log(user)
  }catch(err){
    res.status(500).send({ msg: "Something went wrong" });
  }
};

const verificationEmailTrigger = async (req,res) => {
  try{
    const verificationToken = crypto.randomBytes(20).toString('hex');

  }catch(err){
    res.status(500).send({ msg: "Something went wrong" });
  }
}

const verificationEmail = async (req,res) => {
  try{

  }catch(err){
    res.status(500).send({ msg: "Something went wrong" });
  }
}

module.exports = { userRegistration, userLogin, forgetPassword, checkUserLoginStatus, verificationEmailTrigger, verificationEmail };
