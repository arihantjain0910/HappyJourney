const User = require("../models/user");
const Listing = require("../models/listing");

module.exports.signUp = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUpPage = async(req,res)=>{
    try{
 let { username , email , password} = req.body;
    let newUser =  new User({username , email});
    const registerUser = await User.register(newUser , password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
          return  next();
        }
        req.flash("success" , "Welcome to happyJourney");
    res.redirect("/listings");
    })
    
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup")
    }

}

module.exports.login = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginPage = async(req,res)=>{
req.flash("success", " Welcome to happyJourney , You are logged in!")
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success" , "You are logged out successfully");
        res.redirect("/listings");
    })
}