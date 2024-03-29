const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Register User
router.post('/register', async (req,res) => {
    try{
        //Generate user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //Create a new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });
        //Save new user to database and return a response
        const user = await newUser.save();
        console.log(user); 
        res.status(200).json(user);
    }catch(error){
        console.log(error);
    }
});

//User Login 

router.post('/login', async (req, res) => {
    try{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        res.status(404).json('User not found');
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).json('Incorrect Password');
    }
    
        res.status(200).json(user);
    }catch(error){
        console.log(error)
    }
})

module.exports = router;