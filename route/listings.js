const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js")
const multer  = require('multer')
const {storage} =require("../cloudConfig.js")
const upload = multer({ storage })




router.get("/",wrapAsync(listingController.index));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/:id", wrapAsync(listingController.showListings))

router
.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))


router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingController.renderEditForm))

router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListings))

router.delete("/:id",isOwner,isLoggedIn,wrapAsync(listingController.deleteListings))


module.exports = router;