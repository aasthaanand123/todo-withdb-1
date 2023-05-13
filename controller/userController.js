const { ObjectId } = require("mongodb");
const usersDb = require("../models/databaseUsers");

module.exports.login = async (req, res) => {
  let { username, password } = req.body;
  try {
    //await the user
    let data = await usersDb.getAUser(username, password);

    if (data.username == username && data.password == password) {
      //open user dashboard/posts page which will display all of there posts as well
      // res.render("posts", {
      //   posts: data.posts,
      // });
      //option 2: display dashboard
      res.render("index", {
        user: data,
      });
    } else {
      //i.e user does not exist
      //open sign up page
      res.render("signup");
    }
  } catch (err) {
    console.log(err);
  }
};
//sign up function
module.exports.signUp = async (req, res) => {
  let { username, password } = req.body;
  //create in db
  try {
    let user = new usersDb(username, password); //creating a new user object
    let updatedUser = await user.create();
    // res.render("posts", {
    //   posts: updatedUser.posts,
    // });
    res.render("index", {
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.addPost = async (req, res) => {
  let { title, imageUrl, description } = req.body;
  //get the active user
  try {
    let user = await usersDb.getActiveUser();
    if (user) {
      //i.e users exist
      //add a post to that user
      //uss id pe add kardo post
      //return all posts updated with added one
      let posts = await usersDb.addPostOnId(user._id, {
        _id: new ObjectId(), //every post has an id
        title,
        imageUrl,
        description,
      });
      //then show the dbs
      res.render("posts", {
        posts,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
//when post is clicked render active users posts

module.exports.getActiveUserDashboard = async (req, res) => {
  try {
    let activeUser = await usersDb.fetchActive();
    //render it to login page
    res.render("index", {
      user: activeUser,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getAllPosts = async (req, res) => {
  try {
    let activeUser = await usersDb.fetchActive();
    res.render("posts", {
      posts: activeUser.posts,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.setFalse = async (req, res) => {
  try {
    await usersDb.setFalseUser();
    res.render("login");
  } catch (err) {
    console.log(err);
  }
};
