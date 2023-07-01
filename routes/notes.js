const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const {body, validationResult} = require('express-validator')

//ROUTE 1 : get all the notes /api/auth/fetchallnotes
router.get('/fetchallnotes', fetchUser, async (req, resp) => {
    try{
        const notes = await Notes.find({user : req.user.id});
        resp.json(notes);
    }catch(error){
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
})

//ROUTE 2 : Add a new note using post request /api/auth/addnote
router.post('/addnote', fetchUser, [
    body('title', 'Title can not be empty!').isLength({min : 1}),
    body('description', 'Description can not be empty!').isLength({min : 1}),
],async(req, resp) => {
    try{
        const errors = validationResult(req);

    // id there are errors, return bad request and the errors
    if(!errors.isEmpty()){
        return resp.status(400).json({errors : errors.array()});
    }
    const {title, description, tag, date} = req.body;

    const note = new Notes({title, description, tag, date, user : req.user.id});
    const savedNote = await note.save()
    resp.send(savedNote);
    }catch(error){
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
})

//ROUTE 3 : update an existing note PUT : /api/auth/updatenote Login Required

router.put('/updatenote/:id', fetchUser, async(req, resp) => {
    try{
        const {title, description, tag} = req.body;

    const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if(!note){
            return resp.status(404).send("Not Found!");
        }
        if(note.user.toString() !== req.user.id){
            return resp.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new : true});
        resp.json({note});
    }catch(error){
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
})


//ROUTE 4 : delete an existing note DELETE : /api/auth/deletenote Login Required
router.delete('/deletenote/:id', fetchUser, async(req, resp) => {
    try{
        //Find the note to be deleted

        let note = await Notes.findById(req.params.id);
        if(!note){
            return resp.status(404).send("Not Found!");
        }
        if(note.user.toString() !== req.user.id){
            return resp.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        resp.json({"success" : "Note has been deleted." , note});
    }catch(error){
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
    
})
module.exports = router;