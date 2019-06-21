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
//we are formating our response to have a 200(OKAY) status and using .json on the local notes before we return them

});

app.post('/api/v1/notes', (request, response) => {
// Routes HTTP POST requests to the specified path with the specified callback functions
  const { title, list } = request.body;
  //here we are destructuring title and list fromt the request body

  if (!title || !list) {
    return response.status(422).json('Please provide title and at least one list item');
  //IF the item is not found we want to send them the 422 for unprocessable entry
  }

  const newNote = request.body;
  //here wer are asigning newNote to the request body

  app.locals.notes.push(newNote);
  //pusing the new note into our notes
  response.status(201).json(newNote);
  //when the note is successfully added we send back 201 for newly created
});

app.get('/api/v1/notes/:id', (request, response) => {
  // Routes HTTP GET requests to the specified path with a dynamic id
  const note = app.locals.notes.find(note => note.id == request.params.id);

  if (!note) {
    return response.status(404).json('Note not found');
    //404 is not found status
  } else {
    return response.status(200).json(note);
    //200 is okay status
  }
});

app.delete('/api/v1/notes/:id', (request, response) => {
  //Routes a delete request
  const noteIndex = app.locals.notes.findIndex(note => note.id == request.params.id);

  if (noteIndex === -1) {
    return response.status(404).json('Note not found');
    //404 is not found status
  } else {
    app.locals.notes.splice(noteIndex, 1);
    //splicing out the note

    return response.sendStatus(204);
    //returns the 204 status code no content
  }
});

app.put('/api/v1/notes/:id', (request, response) => {
  //Routes a put request
  const { title, list, background } = request.body;
  //destructures title, list and background romt he request body
  let { id } = request.params;
  //destructuring id from request.params
  id = parseInt(id);
  //parsing the id
  let noteWasFound = false;
  //initializing note was found as false
  const newNotes = app.locals.notes.map(note => {
  //assigning newNotes as the returned array from mapping over notes
    if (note.id == id) {
      noteWasFound = true;
      //reassigning noteWasFound to True if the ids matched
      return { title, list, id, background }
    } else {
      return note
    }
  });

  if (!title || !list) {
    return response.status(422).json('Please provide a title and a list item');
     //If there is no title or no list send them back 422 for unprocessable entry
  }

  if (!noteWasFound) {
    return response.status(404).json('Note not found');
     //when note was not found 404 is not found status code
  }

  app.locals.notes = newNotes
  //asigning notes to new notes

  return response.sendStatus(204);
   //returns the 204 status code no content
});

module.exports = app;
//exporting our app