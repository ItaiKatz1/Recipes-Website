const express = require ("express");
const router = express.Router();
const search_util = require("./utils/search_recipes");
const users_db = require("./utils/DBUtils");
const myRecipe_util = require("./utils/my_recipes");
const favorites_search = require("./utils/favorites_recipes");
const search_family = require("./utils/family_recipes")

router.use((req, res, next)=>{
    console.log("Profile's route");
    next();
});

//here comes the cookie authentication
router.use((req, res, next) => {
    if (req.user_id) {
        next();
    } else {
        throw { status: 401, message: "unauthorized"};
    }
})

router.post('/addFavorite', (req, res) => {
    const username = req.session.username;
    const recipeID = req.body.recipeID;
    
    favorites_search.addFavorites(username,recipeID).
    then(()=>res.sendStatus(200).send({success: true, message: "added to favorites"})).
    catch((error)=>{
        console.log(error);
        res.status(409).send({ message: "could not add the recipe to favorites ", success: false });
    });
});

//favorites_search.addFavoritesDetails(username,info_array)

router.get('/favorites', async (req, res) => {
    const username = req.session.username;
    const favorites_foods = await (users_db.execQuery(`SELECT * FROM userFavorites WHERE username = '${username}'`));
    if(favorites_foods){
        var total_id = getIDOfRecipes(favorites_foods);
        search_util.getRecipesInfoWithUsername(total_id, username).then((info_array)=>res.send(info_array)).
        catch((error)=>
        {
            console.log(error);
            res.sendStatus(500).send({ message: "Could not retrieve the recipes, please try again"});
        });
    };
});


router.get('/lastSeen', async (req, res) => {
    
    const username = req.session.username;
    const last_seen = await (users_db.execQuery(`SELECT * FROM lastSeen WHERE username = '${username}'`));
    if(last_seen){
        var total_id = getIDOfRecipes(last_seen);
        search_util.getRecipesInfoWithUsername(total_id,username).then((info_array)=>res.send(info_array)).
        catch((error)=>
        {
            console.log(error);
            res.sendStatus(500);
        });
        ;
    }
});

//Function which is used to retrieve one of user's own recipes
router.get('/ownRecipe/:recipeId', (req, res) => {
    const {recipeId} = req.params;
    const username = req.session.username;
    //search_params.instructionsRequired = true;
    myRecipe_util.
    getMyRecipe(username, recipeId)
    .then((reqRecipe) => res.send(reqRecipe))
    .catch((error)=>{
        console.log(error);
        res.sendStatus(404);
    })
});

//Function which is used to retrieve user's own recipes
router.get('/ownRecipes', (req, res) => {
    const username = req.session.username;
    //search_params.instructionsRequired = true;
    myRecipe_util.
    getAllMyRecipes(username)
    .then((reqRecipes) => res.send(reqRecipes))
    .catch((error)=>{
        console.log(error);
        res.sendStatus(404);
    })
});

//Function which is used to retrieve one of user's family's recipe
router.get('/familyRecipes/:recipe_id', (req, res) => {
    const {recipe_id} = req.params;
    const username = req.session.username;
    //search_params.instructionsRequired = true;
    search_family.
    getFamilyRecipe(username, recipe_id)
    .then((reqRecipe) => res.send(reqRecipe))
    .catch((error)=>{
        console.log(error);
        res.sendStatus(404);
    })
});


//Function which is used to retrieve user's family recipes
router.get('/familyRecipes', (req, res) => {
    const username = req.session.username;
    //search_params.instructionsRequired = true;
    search_family.
    getAllFamilyRecipes(username)
    .then((reqRecipes) => res.send(reqRecipes))
    .catch((error)=>{
        console.log(error);
        res.sendStatus(404);
    })
})

function getIDOfRecipes(favorites_foods){
    let total_id = [];
    for(var i = 0 ; i<favorites_foods.length; i++){
        let id = favorites_foods[i].food_id;
        total_id.push(id);     
    }
    return total_id;
}

module.exports = router;