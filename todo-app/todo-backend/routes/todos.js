const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const {getAsync, setAsync} = require("../redis/index");

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todos = Number(await getAsync("added_todos"));
  await setAsync("added_todos", todos ? todos + 1 : 0);
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if (!req.todo) return res.sendStatus(405);
  res.json(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (!req.todo) return res.sendStatus(405); // Implement this

  const updatedTodo = {...req.todo._doc, text: req.body.text}
  
  const found = await Todo.findByIdAndUpdate(req.todo._id, updatedTodo, {new: true});

  res.json(found);

});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
