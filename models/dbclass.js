const { ObjectId } = require("mongodb");
const { getDb } = require("../database/database");
//import the db to manipulate its data
const collectionName = "posts";
class Dbclass {
  //setting the properties of an object
  constructor(title, imageUrl, description) {
    (this.title = title),
      (this.imageUrl = imageUrl),
      //how to set this field as an empty array?
      (this.description = description);
  }
  //to save a particular post
  save() {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        await db.insertOne(this);
        let data = await db.updateOne(
          { _id: new ObjectId(this.id) },
          {
            $set: {
              comments: [],
            },
          }
        );
        res(data);
      } catch (err) {
        console.log(err);
        rej(err);
      }
    });
  }
  static getPosts() {
    return new Promise(async (res, rej) => {
      try {
        let data = await getDb().collection(collectionName).find({}).toArray();
        res(data);
      } catch (er) {
        console.log(er);
      }
    });
  }
  static deletePost(id) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        await db.deleteOne({ _id: new ObjectId(id) });
        let data = await db.find({}).toArray();
        res(data);
      } catch (err) {
        rej(err);
      }
    });
  }
  static getPost(id) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        let data = await db.findOne({ _id: new ObjectId(id) });
        res(data);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static updatePost(obj) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        await db.updateOne(
          { _id: new ObjectId(obj.id) },
          {
            $set: {
              title: obj.title,
              description: obj.description,
              imageUrl: obj.imageUrl,
            },
          }
        );
        let data = await db.find({}).toArray();
        res(data);
      } catch (err) {
        rej(err);
      }
    });
  }
  static postComment(comment, id) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionName);
      try {
        let post = await db.findOne({ _id: new ObjectId(id) });
        console.log(post);
        let comments; //returns an obj
        if (post.comments == null || typeof post.comments == "number") {
          comments = [comment]; //if no element add el
          await db.updateOne(
            //update nevertheless
            { _id: new ObjectId(id) },
            {
              $set: {
                comments: comments,
              },
            }
          );
        } else {
          await db.updateOne(
            { _id: new ObjectId(id) },
            {
              $push: { comments: comment },
            }
          );
          //if already element, push new element
        }
        let d = await db.findOne({ _id: new ObjectId(id) });
        console.log(d);
        res(d);
      } catch (err) {
        console.log(err);
      }
    });
  }
}
module.exports.Dbclass = Dbclass;
