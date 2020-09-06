const express = require('express')
const Cours = require('../models/courses')
const Lesson = require('../models/lessons');
const authe = require('../middleware/auth');

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
        const cours = await  Cours.findById(req.params.id).exec();
        if(!cours && req.params.id.length === 24) return res.status(400).send({error:'Wrong id, send a correct course id'});
        res.send(cours);
    } catch(error){
        res.status(500).send(error)
    }
});

// post-- route for create courses .. remember to check data before putting it in data base..
route.post('/courses', authe, async(req, res) =>{
    try{

        const lessons = await Lesson.create(req.body.lessons);
        const course = await Cours.create({
            name:req.body.name,
            genre:req.body.genre,
            authors:req.body.authors,
            tags:req.body.tags,
            description:req.body.description,
            lessons:lessons._id
        });

        res.send({course, lessons});
    } catch(error){
        res.status(500).send(error)
    } 
})

module.exports = route;
// put-- route for update courses .. remember to a logic for valid updates ..