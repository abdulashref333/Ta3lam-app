const express = require('express');
const {Lesson, validateLessonUpdate} = require('../models/lessons');
const authe = require('../middleware/auth');
const route = express();

route.get('/:id', authe, async (req, res) =>{
    const lessons = await Lesson.findById(req.params.id);
    res.send(lessons);
})

route.put('/:id', authe, async(req, res) =>{

    const {error} = validateLessonUpdate(req.body)
    if(error) return res.status(400).send({error:error.message});

    try {
        const lessons = await Lesson.findById(req.params.id).exec();
        req.body.lessons.forEach(element => {
            lessons.lessons.push(element);
        });
        await lessons.save();
        res.send(lessons);    
    
    } catch(error){
        res.status(400).send(error.message);
    }
});

module.exports = route ;