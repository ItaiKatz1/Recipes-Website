const axios = require("axios");
const user_indications = require("./indications_recipes")

//setting of API
const recipes_api_url = "https://api.spoonacular.com/recipes";
//secret key

api_key = "apiKey="+process.env.spooncular_apiKey


const search_recipe = require("./search_recipes");

/**
 * The function returns random recipes 
 * @param {*} username 
 */
async function getRandomRecipes(username){
    let info_random = [1,2,3]
    let promises = [];
    info_random.map(()=>
    promises.push(getSingleRecipe()));
    let info_response = await Promise.all(promises);
    if(username){
        await user_indications.runOnRecipes(username,info_response);
    }
    return info_response;
}

/**
 * The function returns a single recipe to the user
 */
async function getSingleRecipe(){
    var counter = 0;
    while(counter==0){
        let search_response = await axios.get(`${recipes_api_url}/random?${api_key}`);
        var recipes_id = extractSearchResultsIds(search_response);
        var info_recipe = await search_recipe.getSingleRecipeInfo(recipes_id[0]);
        if(info_recipe[0].hasOwnProperty('instructions')){
            var partial_info = await search_recipe.getRecipesInfo(recipes_id);
            counter = 1;
        }
    }
    return partial_info[0];
}


/**
 * The function extracts the IDs of the recipes that were chosen for the user
 * @param {*} search_response 
 */
 function extractSearchResultsIds(search_response){
    let recipes = search_response.data.recipes;
    recipes_id_list = [];
    recipes.map((recipe)=>{
        console.log(recipe.title);
        recipes_id_list.push(recipe.id);
    });
    return recipes_id_list;
}


exports.getRandomRecipes = getRandomRecipes;