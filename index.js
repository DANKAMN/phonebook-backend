const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const Phonebook = require('./models/phonebook')

app.use(cors())

// Define a custom token for Morgan to log request body for POST requests
morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '-';
});

// Use Morgan with the custom token
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :postData', {
    // Morgan combined format along with the custom token 'postData'
    stream: process.stdout // Logs to the console
  })
);

//Persons array
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const time = new Date().toUTCString()

//Get hello in the home page
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

//GET all persons in the phonebook
app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then((persons) => {
      response.json(persons)
    })
})



//GET amount of everyone in the phonebook
app.get('/api/persons/info', async (request, response) => {
  try {
    const count = await Phonebook.countDocuments({});
    response.send(`
      <div>
        <p>Phonebook has the info for ${count} persons</p>
        <p>${time}</p>
      </div>`
    );
  } catch (error) {
    response.status(500).json({ error: 'Error occurred while counting persons' });
  }
});

//GET a person
app.get('/api/persons/:id', (request, response) => {
  Phonebook.findById(request.params.id)
    .then((person) => {
      response.json(person)
    })
})



//POST person
app.use(express.json())

app.post('/api/persons', async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Both name and number are required' });
  }

  try {
    const newPerson = new Phonebook({
      name: body.name,
      number: String(body.number),
    });

    const savedPerson = await newPerson.save();
    response.json(savedPerson);
  } catch (error) {
    response.status(500).json({ error: 'Error occurred while saving the person' });
  }
});

//DELETE person
app.delete('/api/persons/:id', async (request, response) => {
  try {
    const idToDelete = request.params.id;
    const deletedPerson = await Phonebook.findByIdAndDelete(idToDelete);

    if (deletedPerson) {
      console.log(`Deleted person: ${deletedPerson}`);
      response.status(204).end(); // Respond with a 204 No Content if deletion is successful
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  } catch (error) {
    console.error('Error deleting person:', error);
    response.status(500).json({ error: 'Error occurred while deleting the person' });
  }
});




const PORT =process.env.PORT || 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)