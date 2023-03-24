const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');



const app = express();

app.use(cors());
app.use(express.json());

//app.listen(3333);

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  const user = users.find(user => user.username === username);

  if (!user){
    return response.status(404).json({error: "User not found! ;("});
    // return response.status(400).json(user);
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const jaExisteUser =  users.find(user => user.username === username);

  if (jaExisteUser){
    return response.status(400).json({error: "User name already exists!"});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  // users.push({
  //   id: uuidv4(),
  //   name,
  //   username,
  //   todos: []
  // });

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // const {userName} = request.headers;
  const {user} = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const {user} = request;
  const {title, deadline} = request.body;

  const todo = {
    id : uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);
  
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const{user} = request;
  const {id} = request.query;
  const{title, deadline} = request.body;  

  const todo = user.todos.find(todo => todo.id === id);
  if (!todo){
    return response.status(404).json({erro: "ToDo not found!"});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.query;

  const todo = user.todos.find(todo => todo.id === id);
  if (!todo){
    response.json({erro : "ToDo not found!"})
  };

  todo.done = true;
  return response.sendStatus(200);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.query;

  const todo = user.todos.find(todo => todo.id === id);
  if (!todo){
    return response.json({error: "ToDo not found"})
  };

  user.todos.splice(todo, 1);

  return response.sendStatus(201);

});

module.exports = app;