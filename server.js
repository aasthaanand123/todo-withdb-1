const express = require("express");
const PORT = 7564;
const app = express();
const path = require("path");
const { MongoConnected } = require("./database/database");
const hbs = require("hbs");
const postRouter = require("./routes/posts/posts");
const userRouter = require("./routes/users/users");
//router
//middleware functions

app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views", "partials"));
//to load static files
app.use(express.static(path.join(__dirname, "public"))); //only stylesheet
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//feature of users not included in this branch of the project
// app.get("/", (req, res) => {
//   //first page that is loaded
//   res.render("login");
// });
app.use("/post", postRouter);
app.use("/users", userRouter);

//when a connection with mongodb server is established then launch the nodejs server
MongoConnected().then(() => {
  app.listen(PORT, () => {
    console.log(`server is started at http://localhost:${PORT}`);
  });
});
//when mongodb will be connected only then will the nodejs server be launched.
