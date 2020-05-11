const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.select("*")
    .from("posts")
    .then(posts => {
      res.status(200).json({ data: posts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.get("/:id", (req, res) => {
  db("posts")
    .where({ id: req.params.id })
    .first()
    .then(post => {
      console.log(post);
      post
        ? res.status(200).json({ data: post })
        : res.status(404).json({ message: "No post by that Id" });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.post("/", (req, res) => {
  const post = req.body;

  if (isValidPost(post)) {
    db("posts")
      .insert(post, "id")
      .then(ids => {
        res.status(201).json({ data: ids });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: error.message });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "please provide a title and contents for post" });
  }
});

router.put("/:id", (req, res) => {
  const changes = req.body;

  db("posts")
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ data: count });
      } else {
        res
          .status(404)
          .json({ errorMessage: "Could not find any post by that id" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.delete("/:id", (req, res) => {
  db("posts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      console.log(count);
      count ? 
        res.status(204).json({ data: count})
      :
        res.status(404).json({ errorMessage: 'No post by that Id found. Please enter a valid id.'})
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

function isValidPost(post) {
  return Boolean(post.title && post.contents);
}

module.exports = router;
