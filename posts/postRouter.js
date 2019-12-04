const express = require('express');

const router = express.Router();
const db = require('./postDb');

router.get('/', (req, res) => {

  db.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ messege: 'Unable to retrieve posts' });
    })
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.getById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Unable to find post by that ID' });
      }
    })
    .catch(error => {
      res.status(500).json({ messege: 'Unable to retrieve post' });
    })
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res.status(404).json({ message: 'Unable to find post by that ID' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Unable to delete post' });
    })
});

router.put('/:id', (req, res) => {
  const postToUpdate = req.body;
  const id = req.params.id;

  db.getById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: 'Unable to find post by that ID' });
    }
  })
  if(postToUpdate.text) {
    db.update(id, postToUpdate)
      .then(updated => {
        res.status(200).json(updated);
      })
      .catch(error => {
        res.status(500).json({ message: 'Unable to delete post' });
      })
  } else {
    res.status(400).json({ errorMessage: "Please provide text for the post." });
  }
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
