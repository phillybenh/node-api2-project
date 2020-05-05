const express = require('express');
const router = express.Router();
const db = require('./data/db.js');

// POST	/api/posts Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
    if (typeof req.body.title === 'string' && typeof req.body.contents === 'string') {

        db.insert(req.body)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(error => {
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                })
            })
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
})

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
    if (res) {
        if (typeof req.body.text === 'string' && req.body.text.length !== 0) {
            db.insertComment(req.body)
                .then(comment => {
                    res.status(201).json(comment)
                })
                .catch(error => {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist."
                    })
                })
        } else {
            res.status(400).json({
                errorMessage: "Please provide text for the comment."
            })
        }
    } else {
        res.status(500).json({
            error: "There was an error while saving the comment to the database"
        })
    }
})

// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The posts information could not be retrieved.",
            });
        });
});

// GET	/api/posts/:id	Returns the post object with the specified id.
//findById(): this method expects an id as it's only parameter and returns a promise that resolves to the post corresponding to the id provided or an empty array if no post with that id is found.
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The post information could not be retrieved."
            });
        });
})

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
//findPostComments(): the findPostComments accepts a postId as its first parameter and returns a promise that resolves to an array of all comments on the post associated with the post id.
router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            if (comments.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(200).json(comments)
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The post information could not be retrieved."
            });
        });
})

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.




module.exports = router;