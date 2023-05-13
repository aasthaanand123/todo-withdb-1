//users feature is separately introduced
const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");
const postController = require("../../controller/postController");
router.post("/getUser", userController.login); //to login
//add post page show

router.get("/posts", userController.getAllPosts);
router.get("/addPost", postController.getAddPost);
router.post("/addPost", userController.addPost);
router.get("/deletePost", postController.getDeletePost);
router.get("/updatePost", postController.getUpdatePost);
//update
router.post("/updatePost", postController.postUpdatePost);
router.get("/openPost", postController.openPost);
router.post("/submitComment", postController.submitComment);
router.get("/openNextPost", postController.openNextPost);
router.post("/createUser", userController.signUp); //to sign up
router.get("/logout", userController.setFalse);
router.get("/", userController.getActiveUserDashboard); //when home is pressed or /user is requested show the active users dashboard
module.exports = router;
