const { ObjectId } = require("mongodb");
const { getDb } = require("../database/database");

//bring the database here
const collectionName = "users";
class usersDb {
  constructor(username, password) {
    (this.username = username), (this.password = password);
  }
  //create a user(sign up)
  create() {
    return new Promise(async (res, rej) => {
      let db = await getDb().collection(collectionName);
      try {
        //add the user
        await db.insertOne(this);
        //make posts as empty array
        //set every as unactive
        await db.updateMany(
          {},
          {
            $set: { active: false },
          }
        );
        await db.updateOne(
          { _id: this._id },
          {
            $set: { posts: [], active: true }, //on creating set the active field as true since now it is logged in
          }
        );
        //find the created user and resolve it
        let data = await db.findOne({
          username: this.username,
          password: this.password,
        });
        let d = await db.find({}).toArray();
        console.log(d);
        res(data); //updated entry i.e correct post
      } catch (err) {
        console.log(err);
      }
    });
  }
  //gets a single user
  static getAUser(username, password) {
    return new Promise(async (res, rej) => {
      let db = await getDb().collection(collectionName);
      try {
        //if user exists it returns it otherwise returns null
        let user = await db
          .find({ username: username, password: password })
          .toArray(); //not returning data
        if (user[0]) {
          //baaki sab ko false state me dalna hai
          await db.updateMany(
            {},
            {
              $set: { active: false },
            }
          );
          //if user exists so set its field to active to indicate login
          await db.updateOne(
            { _id: new ObjectId(user[0]._id) },
            {
              $set: { active: true },
            }
          );
          let d = await db.find({ _id: new ObjectId(user[0]._id) }).toArray();
          res(d[0]); //active state set to true and updated data sent accordingly
        }
        res(user);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static setFalseUser() {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        await db.updateMany(
          {},
          {
            $set: { active: false },
          }
        );
        let users = db.find({}).toArray();
        res(users);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static getActiveUser() {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        let user = await db.findOne({ active: true });
        res(user);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static addPostOnId(userId, post) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        //get the post array
        let user = await db.findOne({ _id: new ObjectId(userId) }); //returns user object
        let posts = user.posts;
        posts.push(post); //update posts
        await db.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: { posts: posts },
          }
        );
        let userUpd = await db.findOne({ _id: new ObjectId(userId) });
        res(userUpd.posts); //return updated posts array
      } catch (err) {
        console.log(err);
      }
    });
  }
  static getPosts(userId) {
    return new Promise(async (res, rej) => {
      let db = await getDb().collection(collectionName);
      try {
        let user = await db.findOne({ _id: new ObjectId(userId) });
        res(user.posts);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static fetchActive() {
    return new Promise((res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        let user = db.findOne({ active: true });
        res(user);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static DeletepostOfActive(id) {
    return new Promise(async (res, rej) => {
      let db = await getDb().collection(collectionName);
      try {
        let user = await db.findOne({ active: true });
        //find post and delete it
        let posts = user.posts;
        // posts = posts.filter((post) => post._id != new ObjectId(id));
        let newar = [];
        let i;
        posts.forEach((post) => {
          if (post._id != id) {
            newar.push(post);
          }
        });
        //update the users post
        await db.updateOne(
          { _id: user._id },
          {
            $set: { posts: newar },
          }
        );
        //return the updated user post
        let updatedUser = await db.findOne({ _id: user._id });
        res(updatedUser.posts);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static updatePost(post) {
    return new Promise(async (res, rej) => {
      let db = await getDb().collection(collectionName);
      try {
        //update the new post
        let u = await usersDb.fetchActive(); //fetch the active user
        let posts = await usersDb.getPosts(u._id); //fetch the posts of active user
        //update
        let i;
        for (i = 0; i < posts.length; i++) {
          if (posts[i]._id.equals(post.id)) {
            //if that id matches the update post id update array
            posts[i] = {
              _id: new ObjectId(post.id),
              title: post.title,
              imageUrl: post.imageUrl,
              description: post.description,
            };
          }
        }
        //posts array updated above
        //update it in db also
        await db.updateOne(
          { _id: new ObjectId(u._id) },
          {
            $set: {
              posts: posts,
            },
          }
        );
        let user = await db.findOne({ _id: new ObjectId(u._id) });
        res(user.posts);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static nextPost(id) {
    return new Promise(async (res, rej) => {
      try {
        //fetch active user
        let user = await usersDb.fetchActive();
        //posts
        let posts = user.posts;
        let post;
        //find the next post from the id given
        let i;
        for (i = 0; i < posts.length; i++) {
          if (posts[i]._id.equals(id)) {
            //saving next post
            post = posts[i + 1];
            break;
          }
        }
        res(post);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static getPost(id) {
    return new Promise(async (res, rej) => {
      try {
        //fetch active user
        let user = await usersDb.fetchActive();
        //find post of id
        let posts = user.posts;
        let i;
        let p;
        // for (i = 0; i < posts.length(); i++) {
        //   if (posts[i]._id == new ObjectId(id)) {
        //     post = posts[i];
        //   }
        // }
        posts.forEach((post) => {
          if (post._id == id) {
            p = post;
          }
        });
        res(p);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static postComment(comment, id) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        let user = await usersDb.fetchActive();
        let posts = user.posts;
        //find that particular post
        let i = 0;
        for (i; i < posts.length; i++) {
          if (posts[i]._id.equals(id)) {
            //if a comments array exists then append it, if not create it
            if (posts[i].comments) {
              posts[i].comments.push(comment);
            } else {
              posts[i].comments = [];
              //now push it
              posts[i].comments.push(comment);
            }
          }
        }
        //update posts
        await db.updateOne(
          { _id: user._id },
          {
            $set: { posts: posts },
          }
        );
        //resolve the post
        let post = await usersDb.getPost(id);
        res(post);
      } catch (err) {
        console.log(err);
      }
    });
  }
}
module.exports = usersDb;
