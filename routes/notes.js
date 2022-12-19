const express = require('express')
const router = express.Router()
const Notes = require('../models/notesSchema')
const fetchuser=require('../middleware/fetchuser')
const { route, use } = require('./auth')

//get all notes of a user
router.get('/getallnotes',fetchuser, async (req, res) => {
    try {
        const note = await Notes.find({user:req.userId})
        if(!note) res.status(404).send('No notes')
        else{
            res.status(200).send(note)
        }
    }
    catch (err) {
        res.status(500).send('internal server error')
    }
})


// Add a new note
router.post('/addnote',fetchuser,async(req,res)=>{
    req.body.user=req.userId
    let note = await Notes(req.body)
    try{
        note.save((err,result)=>{
            if(err) return res.status(403).send(err.message)
            res.status(200).json({'success':'note added successfully',note:note})
        })
    }
    catch(err){
        res.status(500).send('note cannnot be added due to server error')
    }
})

// Update note
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag}=req.body
    let newnote={}
    if(title) newnote.title=title
    if(description) newnote.description=description
    if(tag) newnote.tag=tag

    try{
    let note=await Notes.findById(req.params.id)
    if(!note) return res.status(404).send('note not found')
    if(note.user.toString()!==req.userId) return res.status(401).send('Not allowed')

    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
    res.json({'updated':'note successfully updated',note:note})
    }
    catch(err){
        res.status(500).send('note cannnot be updated due to server error')
    }
})
module.exports = router

//delete a note
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try{
    const note=await Notes.findById(req.params.id)
    if(!note) return res.status(404).send("note not found")
    if(note.user.toString()!==req.userId) return res.status(401).send('user not allowed')
        note.remove({})
        res.status(200).json({'success':'note deleted successfully',note:note}) 
    }
    catch(err){
        res.status(500).send('note cannnot be deleted due to server error')
    }
})