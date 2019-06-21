const express = require('express');
//express is a node framework that allows us to more easily write our backend
const cors = require('cors');
//cors stands for cross-origin resource sharing,allows servers to specify who can access the assets on the server 

const app = express();
//we are assigning the const app to an invokation to exress

app.use(cors());
//this is mouting the middleware of cors
app.use(express.json());
//this is mounting the middleware of express.json

app.locals.notes = [
//The app.locals object has this property of notes that is a local variable
//These notes were just examples to work with
  { 
    title: 'What you can do with Trapper Keeper', 
    list: [
      { 
        item: 'Create a new note',
        completed: false,
        id: 1
      },
      { 
        item: 'Add list items to your note',
        completed: false,
        id: 2
      },
      { 
        item: 'Edit or delete items on your note',
        completed: false,
        id: 3
      },
      { 
        item: 'Delete your note',
        completed: false,
        id: 4
      },
      { 
        item: 'View completed items',
        completed: true,
        id: 5
      }
    ],
    id: Date.now(),
    background:'#FFF'
  }
]

app.get('/api/v1/notes', (request, response) => {
// Routes HTTP GET requests to the specified path with the specified callback functions
  return response.status(200).json(app.locals.notes);
//we are formating our response to have a 200 status and using .json on the local notes before we return them

});

app.post('/api/v1/notes', (request, response) => {
// Routes HTTP POST requests to the specified path with the specified callback functions
  const { title, list } = request.body;

  if (!title || !list) {
    return response.status(422).json('Please provide title and at least one list item');
//IF the item is not found we want to send them the 422 error code
  }

  const newNote = request.body;

  app.locals.notes.push(newNote);
  response.status(201).json(newNote);
});

app.get('/api/v1/notes/:id', (request, response) => {
  const note = app.locals.notes.find(note => note.id == request.params.id);

  if (!note) {
    return response.status(404).json('Note not found');
  } else {
    return response.status(200).json(note);
  }
});

app.delete('/api/v1/notes/:id', (request, response) => {
  const noteIndex = app.locals.notes.findIndex(note => note.id == request.params.id);

  if (noteIndex === -1) {
    return response.status(404).json('Note not found');
  } else {
    app.locals.notes.splice(noteIndex, 1);

    return response.sendStatus(204);
  }
});

app.put('/api/v1/notes/:id', (request, response) => {
  const { title, list, background } = request.body;
  let { id } = request.params;
  id = parseInt(id);
  let noteWasFound = false;
  const newNotes = app.locals.notes.map(note => {
    if (note.id == id) {
      noteWasFound = true;
      return { title, list, id, background }
    } else {
      return note
    }
  });

  if (!title || !list) {
    return response.status(422).json('Please provide a title and a list item');
  }

  if (!noteWasFound) {
    return response.status(404).json('Note not found');
  }

  app.locals.notes = newNotes

  return response.sendStatus(204);
});

module.exports = app;