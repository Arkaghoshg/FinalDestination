const express = require('express');
const router = express.Router();
const {Player, validateCategory} = require('../models/Player');

router.post('/add',async (req,res) =>{
    // console.log("error detected:", req.body)
    const {error} = validateCategory(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const {username, points} = req.body;
    try {
        let player = await Player.findOne({username});
        if(player){
            player.points += points;
            player.lastUpdated = Date.now();
            await player.save();
        } else {
            player = new Player({username, points});
            await player.save();
        }
        res.json({message: "points successfully added"},player);
    } catch(err){
        console.error(err);
        res.status(500).json({error:"Problem in updating the points"});
    }
});

router.get('/leaderboard',async (req,res) =>{
    try{
        const players = await Player.find().sort({points: -1}).limit(10);
        res.json(players);
    }catch(err){
        console.error(err)
        res.status(500).json({error: "error fetching in Scores"});
    }
});

module.exports =  router;

