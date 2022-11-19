const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Blogs = require('./models/blog')
require('dotenv/config')
// console.log(Blogs);

// Template engine or view engine
// So far we have being serving html files, so we use template engine to render dynamic data
// We have diff template engine like ejs, hbs and gug, but we would use ejs since its quite simple and has nice features
// EJS has a syntax like html but it just allows us to inject dynamic data
// ====== See below how to use EJS and its features ======
// 1) Install ejs --- npm install ejs ... check the package.json to confirm the installation
// 2) To use it you can check it out on npmjs.com
// app.set('view engine',ejs) --- the set enables us to configure some app settings ... so
// ....ejs now knows to go to your views folder and search for the exact file you want to serve but if the
// ... folder isn't titled view then you can create lets say work folder and put in a file like index.ejs 
// ... and input html template...but in the app.js which is our server file.... you need to tell ejs that 
// ... you have a diff folder for your view by doing the below
// app.set('vie engine', ejs), app.set('views','work') ---to show the work we render and not senFile ...
// ... res.render('index')
// ===========================================================================
// app.get('/', (req,res)=>{
//     res.sendFile('./views/index.html',{root:__dirname})
// })
// app.get('/about', (req,res)=>{
//     res.sendFile('./views/about.html',{root:__dirname})
// })
// app.use((req,res)=>{
//     res.sendFile('./views/error.html',{root:__dirname})
// })

app.set('view engine', 'ejs')
// Middleware Examples
// ==== Middleware are codes that runs on the server between a get req and sending a response
// Even the function that run in our request are also middleware, remember that middleware are..
// ..codes that run on the server, the diff is the get only fires a function for certain routes while..
// ..use method runs for every req for all routes
// Logger middleware to log details of every request
// Authentication check middleware for protected routes
// Middleware to parse json data from requests
// Return 404 pages(as we have seen already


app.use((req,res,next)=>{
    console.log('new requset has been made');
    console.log('host:', req.hostname);
    console.log('path:', req.path);
    console.log('methode:', req.method);
    next()
})

// ALL MIDDLEWARES
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
const DbUrl = process.env.DBURL

mongoose.connect(DbUrl)
.then((res)=> console.log('Db connected successfully'))
.catch((err)=>console.log(err))
// START OF TESTING OUR MODELS AND DB
// app.get('/add-blog',(req,res)=>{
//     const BLOGS = new Blogs({
//         title:'Latest newss',
//         message:'We don dey test am',
//         name:'Timapee'
//     })
//     BLOGS.save()
//     .then((result)=>{
//         res.send(result)
//     })
//     .catch((err)=>{
//         console.log(err);
//     })

// })

// // Lets get all the blogs
// app.get('/all-blogs', (req,res)=>{
//     Blogs.find()
//     .then((result)=>{
//         res.send(result)
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// })
// // Lets get a single a single Blog
// app.get('/single-Blog',(req,res)=>{
//     Blogs.findById('636fa65d78152b07abd76b0f')
//     .then((result)=>{
//         res.send(result)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// })

// END OF TESTING
// index.ejs
app.get('/',(req,res)=>{
    Blogs.find()
    .then((result)=>{
        res.render('index', {title:'Home',Blogs: result})       
    })
    .catch((err)=>{
        console.log(err);
    })
})
// app.get('/', (req,res)=>{
    // const newBlogs = [
    //     {title:'Femi likes to code', body:'And also works'},
    //     {title:'Timapee likes to go for break', body:'And also code'},
    //     {title:'Kamso likes to debug', body:'And also laffs'},
    // ];
// })
// about.ejs
app.get('/about', (req,res)=>{
    res.render('about', {title:'About'})
})
// createBlog.ejs
app.get('/createBlog', (req,res)=>{
    res.render('createBlog', {title:'Create Blog'})
})
// error.ejs

// GET,POST AND DELETE REQUEST
// ============================POST REQUEST===============================
// Now we use app.post('')
// Ensure that the name attribute on the form is same as the key property used in the Schema
// Also we need a middleware that would attach body to the req,see below
// app.use(express.urlencoded())
app.use(express.urlencoded({extended:true}))
app.post('/', (req,res)=>{
    console.log(req.body);
    const singleBlogs = new Blogs(req.body)
    singleBlogs.save()
    .then((rr)=>{
        res.redirect('/')
    })
    .catch((err)=>{
        console.log(err);
    })
})

// ==========Routing to details.ejs============================================
app.get('/Blogs/:id',(req,res)=>{
    const id = req.params.id
    Blogs.findById(id)
    .then((Result)=>{
        res.render('details',{Blogs:Result,title:'details page'})
    })
    .catch((err)=> console.log(err))
})
// DELLETE

app.delete('/index/:id', (req,res)=>{
    const id = req.params.id
    Blogs.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/'})
    })
    .catch((err)=>{
        console.log(err);
    })
})


app.use((req,res)=>{
    res.render('error', {title:'error'})
})
app.listen(2000)