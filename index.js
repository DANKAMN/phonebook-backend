const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const Phonebook = require('./models/phonebook')

// const allowedOrigins = ['https://phonebook-dankamn.netlify.app'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));

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
// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)

//     persons = persons.filter(person => person.id !== id) 

//     console.log('Persons after deletion:', persons);

//     response.status(204).end()
// })



const PORT =process.env.PORT || 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)