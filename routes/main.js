const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile/user/:userId", ensureAuth, postsController.getProfile);
router.get("/addpost", ensureAuth, postsController.getAddPost);
router.get("/feed", ensureAuth, postsController.getFeed);
router.put("/feed/likePost/:id", postsController.likePostOnFeed);
router.get("/bookmarks", postsController.getBookmarks); // WIP
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
