const { ObjectId } = require("mongodb");
const { getDb } = require("../database/database");
//import the db to manipulate its data
const collectionName = "posts";
class Dbclass {
  //setting the properties of an object
  constructor(title, imageUrl, description) {
    (this.title = title),
      (this.imageUrl = imageUrl),
      (this.description = description);
  }
  //to save a particular post
  save() {
    return getDb().collection(collectionName).insertOne(this);
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
        let data = db.findOne({ _id: new ObjectId(id) });
        res(data);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static updatePost(obj) {
    return new Promise(async (res, rej) => {
      let db = await getDb().collection(collectionName);
      try {
        db.updateOne(
          { _id: new ObjectId(obj.id) },
          {
            $set: {
              title: obj.title,
              description: obj.description,
              imageUrl: obj.imageUrl,
            },
          }
        );
        let data = db.find({}).toArray();
        res(data);
      } catch (err) {
        rej(err);
      }
    });
  }
}
module.exports.Dbclass = Dbclass;
