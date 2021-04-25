const express = require ("express");
const router = express.Router();
const search_util = require("./utils/search_recipes");
const search_random = require("./utils/random_recipes");
const last_seen = require ("./utils/last_seen");
const { query } = require("express");

router.use((req, res, next)=>{
    console.log("Recipes route");
    next();
});

//routes

router.get("/search/:searchQuery/amount/:num", (req, res) => {
const {searchQuery, num} = req.params;
//set the params
let search_params = {};
search_params.query = searchQuery;
search_params.number = num;
search_params.instructionsRequired = true;
const username = req.session.username;

//check if the queries parameter exists
console.log(req.query);
search_util.extractQueryParams(req.query, search_params);
console.log('search params before', search_params);
search_util
.searchForRecipes(search_params,username)
.then((info_array)=>res.send(info_array))
.catch((error)=>{
    console.log(error);
    res.sendStatus(500);
});

});

router.get("/search/:recipeID", async (req, res) => {
    const {recipeID} = req.params;
    const username = req.session.username;
    try{
        if(username){
            await last_seen.addToLastSeen(username,recipeID);
            await last_seen.addToSeen(username,recipeID);
        }
        }catch(error){
            console.log(error); 
        }
    // setting params

    search_util.getSingleRecipeInfo(recipeID)
    .then((relevantRecipeData)=>res.send(relevantRecipeData))
    .catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    });
});


router.get('/random', async (req, res) => {
    //const {num} = req.params;
    //set the params
    search_params = {};
    search_params.number = 1;
    const username = req.session.username;
    search_random.
    getRandomRecipes(username).then((info_array)=>res.send(info_array))
    .catch((error)=>{
        console.log(error);
        res.sendStatus(500);
});

});


module.exports = router;