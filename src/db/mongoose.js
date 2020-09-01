const mongoose = require('mongoose');

mongoose.connect(process.env.HOST,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
})
    .then(()=>console.log('connection successed'))
    .catch(()=>console.log('connection falid'));