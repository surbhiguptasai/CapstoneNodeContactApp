const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

BlogPosts.create(
  'Herry Potter',
  'Since the release of the first novel, Harry Potter and the Philosophers Stone.', 
  'J. K. Rowling', '26 June 1997');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});



router.post('/', jsonParser, (req, res) => {
   const requiredFields = ['title', 'content','author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content,req.body.author,req.body.publishDate);
  res.status(201).json(item);
});

// Delete BlogPosts (by id)!
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted Blog posts item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated BlogPosts, ensure has
// required fields. also ensure that BlogPosts id in url path, and
// BlogPosts id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.updateItem` with updated BlogPosts.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields =  ['title', 'content','author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author:req.body.author,
    publishDate:req.body.publishDate
  });
  res.status(200).json(updatedItem);
})

module.exports = router;