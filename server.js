const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Connexion à la base de données MongoDB
const dbURI =
  "mongodb+srv://AllvnCr:AllvnCr2000&@cluster0.y0ai7.mongodb.net/Allumi?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Création d'un modèle pour stocker les posts
const PostSchema = new mongoose.Schema({
  author: String,
  title: String,
  url: String,
  abstract: String,
});

const Post = mongoose.model("Post", PostSchema);

const app = express();
app.use(cors());

// Middleware pour parser les données envoyées depuis le formulaire
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Route POST pour stocker les données du formulaire dans la base de données
app.post("/api/posts", async (req, res) => {
  try {
    const { author, title, url, abstract } = req.query;
    const post = new Post({ author, title, url, abstract });
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    res.status(500).send({ error: "An error occurred while saving the post!" });
  }
});

// Route GET pour récupérer la liste des posts
app.get("/api/posts", async (req, res) => {
  try {
    const results = await Post.find({});
    res.send(results);
  } catch (err) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the posts!" });
  }
});

// Route DELETE pour supprimer un post par son identifiant
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send({ error: "Post not found!" });
    }
    res.send({ message: "Post deleted successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the post!" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
