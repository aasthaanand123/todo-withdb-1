const usersDb = require("../models/databaseUsers");

module.exports.getPost = async (req, res) => {
  try {
    let data = await usersDb.getPosts();
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
module.exports.postAddPost = async (req, res) => {
  //first add the post
  let { title, imageUrl, description } = req.body;
  try {
    //fetch active user
    let user = await usersDb.fetchActive(); //returns active user array
    //on that id add a post
    let posts = await usersDb.addPostOnId(user._id);
    res.render("posts", {
      posts,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getDeletePost = async (req, res) => {
  let id = req.query.id; //post id
  let data = await usersDb.DeletepostOfActive(id);
  res.render("posts", {
    posts: data,
  });
};
module.exports.getUpdatePost = async (req, res) => {
  try {
    let id = req.query.id;
    let user = await usersDb.fetchActive(); //fetch active user
    //find post that matches id
    let data;
    //user.posts is an array of objects
    for (i = 0; i < user.posts.length; i++) {
      if (user.posts[i]._id == id) {
        data = user.posts[i];
      }
    }
    //got the post
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
    //with id
    //1. fetch active user
    //2. update the post (of given id) of the active user
    let data = await usersDb.updatePost(obj); //bring the updated posts array
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
    let post = await usersDb.getPost(id);

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
      let post = await usersDb.postComment(comment, id); //returns updated post
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
    let post = await usersDb.nextPost(id);
    if (post) {
      res.render("FullpgWithComments", {
        post,
      });
    } else {
      res.redirect("/user/posts");
    }
  } catch (err) {
    console.log(err);
  }
};
