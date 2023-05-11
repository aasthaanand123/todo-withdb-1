const { Dbclass } = require("../models/dbclass");
module.exports.getPost = async (req, res) => {
  try {
    let data = await Dbclass.getPosts();
    res.render("posts", {
      posts: data,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAddPost = (req, res) => {
  res.render("addPostform");
};
module.exports.postAddPost = (req, res) => {
  //first add the post
  let { title, imageUrl, description } = req.body;
  //add data to database
  let newPost = new Dbclass(title, imageUrl, description);
  newPost
    .save()
    .then((data) => {
      res.redirect("/post");
    })
    .catch((Er) => {
      console.log(Er);
    });
};
module.exports.getDeletePost = async (req, res) => {
  let id = req.query.id;
  let data = await Dbclass.deletePost(id);
  res.render("posts", {
    posts: data,
  });
};
module.exports.getUpdatePost = async (req, res) => {
  try {
    let id = req.query.id;
    let data = await Dbclass.getPost(id);
    res.render("updatePostform", {
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.postUpdatePost = async (req, res) => {
  try {
    let obj = req.body;
    let data = await Dbclass.updatePost(obj);
    res.render("posts", {
      posts: data,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.openPost = async (req, res) => {
  try {
    let id = req.query.id;
    let post = await Dbclass.getPost(id);

    res.render("FullpgWithComments", {
      post,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.submitComment = async (req, res) => {
  try {
    let { comment, id } = req.body;
    if (comment) {
      let post = await Dbclass.postComment(comment, id);
      res.render("FullpgWithComments", {
        post,
      });
    } else {
      //if input comment is empty then simply render the page as is without adding an empty comment in the array and page
      let data = await Dbclass.getPost(id);
      res.render("FullpgWithComments", {
        post: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.openNextPost = async (req, res) => {
  try {
    let id = req.query.id; //of current post
    let post = await Dbclass.nextPost(id);
    if (post) {
      res.render("FullpgWithComments", {
        post,
      });
    } else {
      res.redirect("/post/posts");
    }
  } catch (err) {
    console.log(err);
  }
};
