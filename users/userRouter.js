const express = require('express');

const router = express.Router();
const userDb = require('./userDb');
const postDb = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  const newUser = req.body;

  userDb.insert(newUser)
    .then(userAdded => {
      res.status(201).json(userAdded);
    })
    .catch(error => {
      res.status(500).json({ messege: 'Unable to add user' });
    })
});

// Not working..
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postBody = req.body;

  postDb.insert(postBody)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      res.status(500).json({ messege: 'Unable to add post' });
    })
});

router.get('/', (req, res) => {
  userDb.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ messege: 'Unable to retrieve users' });
    })
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  userDb.getById(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ messege: 'Unable to retrieve user' });
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;

  userDb.getUserPosts(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({ messege: 'Unable to retrieve user posts' });
    })
});

router.delete('/:id', validateUserId,  (req, res) => {
  const id = req.params.id;

  userDb.remove(id)
    .then(deleted => {
        res.status(200).json(deleted);
    })
    .catch(error => {
      res.status(500).json({ message: 'Unable to delete user' });
    })
});

router.put('/:id', validateUserId, (req, res) => {
  const userToUpdate = req.body;
  const id = req.params.id;

  if (userToUpdate.name) {
    userDb.update(id, userToUpdate)
      .then(updated => {
        res.status(200).json(updated);
      })
      .catch(error => {
        res.status(500).json({ message: 'Unable to update user' });
      })
  } else {
    res.status(400).json({ errorMessage: "Please provide name for the user." });
  }
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  userDb.getById(id)
    .then(user => {
      if(!user) {
        console.log(user)
        res.status(404).json({ message: 'Unable to find user by that ID' });
      }
    })

    next();
  
}

function validateUser(req, res, next) {
  const body = req.body;

  if (body) {
    if (!body.name) {
      res.status(400).json({ message: "missing required name field" });
    }
    next();
  } else {
    res.status(400).json({ message: "missing user data" });
  }
}

function validatePost(req, res, next) {
  const body = req.body;

  if (body) {
    if (!body.text) {
      res.status(400).json({ message: "missing required text field" });
    }
    next();
  } else {
    res.status(400).json({ message: "missing post data" });
  }
}

module.exports = router;
