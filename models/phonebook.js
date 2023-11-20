const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('connect to url', url)

mongoose.connect(url)
.then((result) => {
    console.log('Connected to mongoDB')
}) 
.catch((error) => {
    console.log('Error connecting to mongoDB: ', error)
})

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      number: {
        type: String, // Ensure the correct type is used
        required: true,
      },
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
}
})

module.exports = mongoose.model('Phonebook', phonebookSchema)