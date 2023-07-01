const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = 'SohamIsagood$bOY';
//ROUTE 1 : Create a User using : POST "/api/auth". Doesn't require auth.
router.post('/',[
    body('email', 'Enter a valid email address').isEmail(),
    body('name', 'Enter a valid name.').isLength({min : 2}),
    body('password', 'Password must be atleast of 5 characters').isLength({min : 5}),
], async (req, resp) => {
    // if there are errors, return Nad request and the errors
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return resp.status(400).json({errors : errors.array()});
    }

    let user = await User.findOne({email : req.body.email});
    //check whether email exist already
    try{
        if(user){
            return resp.status(400).json({errors : "A user with this email has been already registered!"});
        }
        //creat a new user
        const salt = await bcrypt.genSalt(10)
        const securedPassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name : req.body.name,
            password : securedPassword,
            email : req.body.email,
        });
        const data = {
            user: {
                id : user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log(authtoken);
        // resp.json(user);
        resp.json({authtoken})
        }catch(error){
            console.log(error.message);
            resp.status(500).send("Unexpected error occured");
        }
    // .then(user => resp.json(user))
    // .catch(error => {resp.json({error : "Entered Email Address is already registered!", message : error.message})});

})

//ROUTE 2 : Login
router.post('/login',[
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Password can not be blank').exists(),
], async (req, resp) => {

    // if there are errors, return Nad request and the errors
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return resp.status(400).json({errors : errors.array()});
    }

    const {email, password} = req.body;

    try{
        let user = await User.findOne({email});
        if(!user){
            return resp.status(400).json({error : "Please try login with correct Credentials."});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return resp.status(400).json({error : "Please try login with correct Credentials."});
        }
        const data = {
            user : {
                id : user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        resp.json(authtoken);
    }catch(error){
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
})


//ROUTE 3 : get logged in user detail POST:  /api/auth.getuser  Login Required

router.post('/getuser',fetchUser, async (req, resp) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        resp.send(user);
    }catch(error){
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
})
module.exports = router;