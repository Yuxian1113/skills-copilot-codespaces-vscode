// Create web server
// Create a web server that listens on port 3000 and serves the following responses:
// GET /comments - returns a list of comments
// POST /comments - creates a new comment
// GET /comments/:id - returns a single comment with the id
// PUT /comments/:id - updates the comment with the id
// DELETE /comments/:id - deletes the comment with the id
// The comments should be stored in a file called comments.json
// The comments.json file should be an array of objects with the following keys:
// id: a unique id for the comment
// text: the text of the comment

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Read comments from comments.json file
function readComments() {
    const commentsData = fs.readFileSync('comments.json');
    return JSON.parse(commentsData);
}

// Write comments to comments.json file
function writeComments(comments) {
    fs.writeFileSync('comments.json', JSON.stringify(comments));
}

// GET /comments - returns a list of comments
app.get('/comments', (req, res) => {
    const comments = readComments();
    res.json(comments);
});

// POST /comments - creates a new comment
app.post('/comments', (req, res) => {
    const comments = readComments();
    const newComment = req.body;
    comments.push(newComment);
    writeComments(comments);
    res.json(newComment);
});

// GET /comments/:id - returns a single comment with the id
app.get('/comments/:id', (req, res) => {
    const comments = readComments();
    const commentId = req.params.id;
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

// PUT /comments/:id - updates the comment with the id
app.put('/comments/:id', (req, res) => {
    const comments = readComments();
    const commentId = req.params.id;
    const updatedComment = req.body;
    const index = comments.findIndex((c) => c.id === commentId);
    if (index !== -1) {
        comments[index] = updatedComment;
        writeComments(comments);
        res.json(updatedComment);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

// DELETE /comments/:id - deletes the comment with the id
app.delete('/comments/:id', (req, res) => {
    const comments = readComments();
    const commentId = req.params.id;
    const index = comments.findIndex((c) => c.id === commentId);
    if (index !== -1) {
        const deletedComment = comments.splice(index, 1)[0];
        writeComments(comments);
        res.json(deletedComment);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

