const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingschema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
      if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You are not logged in!");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner  = async(req,res,next) => {
   let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You have not permission to edit")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing= (req,res,next)=>{
let {error} = listingschema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).joins(",");
        throw new ExpressError(400 , errMsg)
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).joins(",");
        throw new ExpressError(400 , errMsg)
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor  = async(req,res,next) => {
   let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You have not author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}