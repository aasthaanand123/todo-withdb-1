const express = require("express");
const { Dbclass } = require("../../models/dbclass");
const router = express.Router();
const postController = require("../../controller/postController.js");
//requests
router.get("/", postController.getPost);
router.get("/posts", (req, res) => {
  res.redirect("/post");
});
//adding a post feature
router.get("/addPost", postController.getAddPost);
router.post("/addPost", postController.postAddPost);
//deleting a post feature
router.get("/deletePost", postController.getDeletePost);
router.get("/updatePost", postController.getUpdatePost);
router.post("/updatePost", postController.postUpdatePost);
router.get("/openPost", postController.openPost);
router.post("/submitComment", postController.submitComment);
router.get("/openNextPost", postController.openNextPost);
module.exports = router;
