const express = require('express')
const {Cours, validateCourse, validateUpdates} = require('../models/courses')
const {Lesson} = require('../models/lessons');
const {Review} = require('../models/reviews');
const authe = require('../middleware/auth');
const admin = require('../middleware/isAdmin');
const multer = require('multer');

const upload = multer({
    dest:'public/posters',
    limits:{
        fileSize:2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/i)){
            return cb(new Error('please upload only image.'))
        }
        return cb(null,true);
    }
})
const route = express.Router()

route.get('/', async (req, res) =>{
    try{
        const courses = await Cours.find({}).exec();
        res.send(courses);
    } catch(e){
        res.sendStatus(404);
    }
});

route.get('/:id', async (req, res) =>{
    try{
        const cours = await  Cours.findById(req.params.id)
        .populate('lessons')
        .populate('reveiws')
        .exec();
        
        if(!cours && req.params.id.length === 24) return res.status(400).send({error:'Wrong id, send a correct course id'});
        res.send(cours);
    } catch(error){
        res.status(500).send(error)
    }
});
// post-- route for create courses .. remember to check data before putting it in data base..
route.post('/', authe, async(req, res) =>{

    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send({error: error.details[0].message});

    try{
        
        const lessons = await  Lesson.create({lessons: req.body.lessons});
        const reviews = await  Review.create({reviews:[]});
        // console.log(reviews);
        const course = await Cours.create({
            name:req.body.name,
            genre:req.body.genre,
            authors:req.body.authors,
            tags:req.body.tags,
            description:req.body.description,
            lessons:lessons._id,
            reveiws:reviews._id
        });
        res.send({course, lessons, reviews});

    } catch(error){
        res.status(500).send(error.message)
    } 
})
//  add image for course background ..
route.post('/poster/:id', authe, upload.single('poster'), async(req, res) =>{
    upload(req, res, async function (error) {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          res.status(400).send({error});
        } else if (err) {
          // An unknown error occurred when uploading.
          res.status(500).send({error:'please try again.'});
        }
     
        // Everything went fine.
        const cours = await Cours.findById(req.params.id).exec();
        if(!cours) return res.status(404).send({error:'Not Found'});
        cours.poster = '/posters/'+ req.file.filename;
        await cours.save();
        res.send(cours);
    })
})
//  delete the course 
route.delete('/:id', authe, admin, async (req, res) =>{
    try{
        const cours = await Cours.findByIdAndRemove(req.params.id).exec();
        if(!cours) return res.status(404).send({error:'Not found'})
        res.send('Ok'); // i can't define what should i return here ..
    } catch(error){
        res.status(500).send({error:error.message});
    }
})
//  update authors ..
route.put('/:id', authe, async(req, res) =>{
    //check the content names and values ..
    const {error} = validateUpdates(req.body);
    if(error) return res.status(400).send({error:error.message});
    try{
        const cours = await Cours.findById(req.params.id).exec();
        if(!cours) return res.statusCode(404);
        // do acctual updates ..
        for(let key in req.body){
            cours[key] = req.body[key];
        }
        await cours.save();
        res.send(cours);
    } catch(error){
        res.status(500).send({error:error.message})
    }
});

module.exports = route;