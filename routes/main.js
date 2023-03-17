const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const profileController = require("../controllers/updateProfile");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile/:userName", ensureAuth, postsController.getProfile);
router.get("/addpost", ensureAuth, postsController.getAddPost);
router.get("/feed", ensureAuth, postsController.getFeed);
router.put("/feed/likePost/:id", postsController.likePostOnFeed);
router.get("/bookmarks", postsController.getBookmarks); // WIP
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

// edit profile
router.get("/editprofile", ensureAuth, profileController.getEditProfile);
router.post("/updateprofile", upload.single("file"), ensureAuth, profileController.updateProfile);

module.exports = router;
