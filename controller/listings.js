const Listing = require("../models/listing");

module.exports.index = (async(req,res)=>{
    let allListing =   await Listing.find({})
    res.render("listings/index.ejs" , {allListing});
    
})

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListings =async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews" , populate : {path  :  "author"}}).populate("owner");
    if(!listing){
        req.flash("error" , "Listing you are requested for does not exixts")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs" , {listing})
}

module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url ," -----  ", filename )
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image ={url , filename}
    await newListing.save();
    req.flash("success" , "New route created");
    res.redirect("/listings");
    // let{title, description, image, price ,location, country} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing)
    res.render("listings/edit.ejs" , {listing});

}

module.exports.updateListings = async(req,res)=>{
    let {id} = req.params;
   let listing =  await Listing.findByIdAndUpdate(id ,{...req.body.listing})
   if(typeof req.file != "undefined"){
   let url = req.file.path;
    let filename = req.file.filename;
    listing.image ={url , filename}
    await listing.save();
   }
    req.flash("success" , "listings updated!");
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListings = async(req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success" , "listing deleted!");
    res.redirect("/listings");
}