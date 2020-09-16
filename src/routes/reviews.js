const express = require('express');
const authe = require('../middleware/auth');
const {Review, validateReview} = require('../models/reviews');
const route = express.Router();

route.get('/:id', async(req, res) =>{
    try{
        // id of reviews.
        const reviews = await Review.findById(req.params.id).exec();
        res.send(reviews);
    } catch(error){
        res.status(500).send({error:error.message});
    }
})
// add review to the cours wiht the id of the review doc from course json..
route.post('/:id', authe, async(req, res) =>{   
    
    const {error} = validateReview(req.body.review);
    if(error) return res.status(400).send({error:error.message});
    try{
        // console.log(req.body)
        const reviews = await Review.findById(req.params.id).exec();
        if(!reviews) return res.status(400).send({error:'object not found'});
        req.body.review.userId = req.user._id;
        req.body.review.username = req.user.name;
        reviews.reviews.push(req.body.review);
        await reviews.save();

        res.send(reviews);
    } catch(error){
        res.status(400).send({error:error.message});
    }
})

route.put('/:id', authe, async(req, res) =>{
    const {error} = validateReview(req.body.review)
    if(error) return res.status(400).send(error.details[0].message);
    try{
        
        const review =  await Review.findById(req.params.id)
        // console.log(typeof(req.user._id)===typeof(review.reviews[0].userId))
        for(let e of review.reviews){
            // console.log();
            if(String(e.userId)===String(req.user._id)){
                e.stars = req.body.review.stars;
                e.content = req.body.review.content;
                break;
            }
        }
        res.send(review)
    } catch(error){
        res.status(500).send(error.message)
    }
});

route.delete('/:id', authe, async(req, res) =>{

})
module.exports = route;