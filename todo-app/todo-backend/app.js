const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');
const { getAsync } = require('./redis');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/todos', todosRouter);
app.get("/statistics", async (req, res) => {

    const todoscount = await getAsync("added_todos")

    res.json({
        "added_todos": todoscount
    })
})

module.exports = app;
