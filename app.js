if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingschema , reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
//const cookieParser = require("cookie-parser")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//app.use(cookieParser("secretcode"))


const listingsRoute = require("./route/listings.js");
const reviewsRoute = require("./route/reviews.js");
const usersRoute = require("./route/users.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


const dbURL = process.env.ATLASDBURL;

main()
.then(()=>{
    console.log("connected to db")
})
.catch((err) => 
{console.log(err)
});


const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600  
});

store.on("error" ,()=>{
    console.log("Error in mongo session store", err);
})

const sessionOption = {
    store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
   cookie: { 
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
}
}




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/register",(req,res)=>{
//     let { name = "anonymous" } = req.query;
//     req.session.name = name;
//     req.flash("success", "users register successfully!");
//     res.redirect("/hello");
// })

// app.get("/hello",(req,res)=>{
//     res.send(`Hello , ${req.session.name}`);
// })


async function main() {
  await mongoose.connect(dbURL);
}



// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","INDIA" , {signed : true});
//     res.send("signed cookie sent");
// })

// app.get("/getcookies",()=>{
//     res.cookie("Greet" , "Namaste");
//     res.cookie("Location" , "India");
//     res.send("Send you some cookies!")
// })
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "Arihant"
//     })
//     let registerUser = await User.register(fakeUser , "helloWorld");
//     res.send(registerUser);

// })



app.use("/listings" , listingsRoute);
app.use("/listings/:id/reviews" , reviewsRoute)
app.use("/", usersRoute);



// app.get("/",(req,res)=>{
//     res.send("Working App");
// })



// app.get("/testListing" ,(req,res)=>{
//     let sampleListings = new Listing({
//         title: "My new home",
//         description: "located in bhilwara",
        
//         price : 25000,
//         location : "Bhilwara , Rajasthan",
//         country : "India"

//     })

//     sampleListings.save()
//     .then((res)=>{
//         console.log(res);
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// })




app.all("*", (req,res,next)=>{
    next(new ExpressError(404 , "Page not found"));
});

app.use((err,req,res,next)=>{
    let {status , message} = err;
    res.status(status).send(message);
})

app.listen(8080, ()=>{
    console.log("listening at port 8080");
})