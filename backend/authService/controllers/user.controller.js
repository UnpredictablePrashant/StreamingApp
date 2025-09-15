const User = require("../models/user.model").User;
const bcrypt = require("bcrypt");
const jwt = require('../util/jwtAuth')
var crypto = require("crypto");
const cookieParser = require('cookie-parser');

const nodemailer = require("nodemailer");


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const userRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Create new user
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      password: hash,
    });

    const savedUser = await newUser.save();

    // Remove sensitive data before sending response
    const userData = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role
    };

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: userData
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration"
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const verified = bcrypt.compareSync(password, user.password);
    if (!verified) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const token = jwt.jwtTokenGenerator(user.email);
    
    // Remove sensitive data before sending
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role // Include the user's role
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: "An error occurred during login" 
    });
  }
};

const checkUserLoginStatus = async (req, res) => {
  try {
    const token = req.cookies.token;
    const verify = jwt.jwtTokenVerify(token);
    
    if (verify) {
      const user = await User.findOne({ email: verify.email });
      if (user) {
        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        res.json({ 
          success: true,
          message: "Verified",
          user: userData
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Not verified"
      });
    }
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
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
  //TODO: this needs to be modified based on the type of email carrier we choose
  try{
    const verificationToken = crypto.randomBytes(20).toString('hex');
    let user = await User.findOneAndUpdate({
      email: req.body.email
    },
    {
      verificationToken: verificationToken,
      verificationTokenStatus: true
    })
    verificationEmail(verificationToken, req.body.email)
    res.send({msg: "Verification Email Sent"})
  }catch(err){
    res.status(500).send({ msg: "Something went wrong" });
  }
}

const verificationEmail =  (verificationToken, email) => {
  try{    
    const transporter = nodemailer.createTransport({
      host: "smtp.forwardemail.net",
      port: 465,
      secure: true,
      auth: {
        user: "prashantdey@mailsire.com",
        pass: "Prashant123",
      }
    });
    const info =  transporter.sendMail({
      from: '"Fred Foo 👻" <prashantdey@mailsire.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: `${process.env.HOST}/val/${verificationToken}/${email}`, // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
  
    
  }catch(err){
    res.status(500).send({ msg: "Something went wrong" });
  }
}

const verificationEmailAfterUserClick = async (req,res) => {
  try{
    emailVerificationTokenFromUrl = req.params['vid']
    email = req.params['email']
    let user = User.findOne({email: email, verificationToken: emailVerificationTokenFromUrl, verificationTokenStatus: true})
    if(user == null){
      res.send({msg: "Wrong Token"})
    }else{
      console.log('Successfully Validated')
    }
  }catch(err){
    res.status(500).send({ msg: "Something went wrong" });
  }
}

const newPasswordAdd = async (req,res) => {

}

module.exports = { userRegistration, userLogin, forgetPassword, checkUserLoginStatus, verificationEmailTrigger, verificationEmail,verificationEmailAfterUserClick, newPasswordAdd };
