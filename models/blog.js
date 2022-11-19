// require mongoose
// From mongoose we use a method which is Schema(this defines the structure of the doc we would
// ...store in a collection, its the thing that a model raps around, notr the S in Schema is capitalized)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

},{timestamps:true})

// lets create our model(model is what surrounds the Schema and provides us with an interface
// ...by which to communicate with a DB)
const Blogs = mongoose.model('Blog',blogSchema)

module.exports = Blogs