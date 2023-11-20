const mongoose = require('mongoose')

const password = process.argv[2]

const exit = process.argv.length < 3
const find = process.argv.length === 3
const save = process.argv.length === 5

const url =`mongodb+srv://phonebook:${password}@cluster0.acl5lju.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const phonebook = new Phonebook({
    name: process.argv[3],
    number: process.argv[4]
})


if(exit) {
    console.log('add password, name and number as arguments')
    process.exit(1)
}

if(save) {
    phonebook.save().then(result => {
        console.log(`added ${phonebook.name} number ${phonebook.number} to phonebook`)
        mongoose.connection.close()
    })
}

if(find) {
    Phonebook.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} 

