const axios = require("axios");
const user_indications = require("./indications_recipes")
//setting of API
const recipes_api_url = "https://api.spoonacular.com/recipes";
const DButils = require('./DBUtils');
//secret key
api_key = "apiKey="+process.env.spooncular_apiKey


/**
 * The function extracts relevant data from the query's params
 * @param {*} query_params 
 * @param {*} search_params 
 */
function extractQueryParams(query_params, search_params){
    
    const params_list = ["diet","cuisine","intolerance"];
    params_list.forEach((param)=>{
        if(query_params[param]){
            search_params[param] = query_params[param];
        }
    });
    console.log(search_params);
}
/**
 * The function returns a certain amount of recipes to a specific user
 * @param {*} username 
 * @param {*} search_params 
 */
async function searchForRecipes(search_params,username){
    console.log('search params', search_params);
    let search_response = await axios.get(`${recipes_api_url}/search?${api_key}`,
    {
        params: search_params,    
    }    
    );

    const recipes_id_list = extractSearchResultsIds(search_response);
    console.log(recipes_id_list);
    //get recipe info by id
    let info_array = await getRecipesInfo(recipes_id_list);
    if(username){
        await user_indications.runOnRecipes(username,info_array);
    }
    console.log("info_array: ", info_array);
    return info_array;
}

/**
 * The function returns the information of each recipe's ID in the list
 * @param {*} recipes_id_list 
 */
async function getRecipesInfo(recipes_id_list){
    let promises = [];
    recipes_id_list.map((id)=>
    promises.push(axios.get(`${recipes_api_url}/${id}/information?${api_key}`)));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractRelevantRecipeData(info_response);
    return relevantRecipeData;
}

/**
 * The function returns the information of a specific recipe
 * @param {} search_param 
 */
async function getSingleRecipeInfo(search_param){
    let promises = [];
    promises.push(axios.get(`${recipes_api_url}/${search_param}/information?${api_key}`));
    var info_response = await Promise.all(promises);
    let relevantRecipeData = extractRelevantDetailedRecipeData(info_response);
    let ingredients = [];
    ingredients.push(extractIngredients(relevantRecipeData));
    relevantRecipeData[0].ingredients = ingredients;
    delete relevantRecipeData[0].extendedIngredients;
    return relevantRecipeData;
}

function extractRelevantRecipeData(recipe_info){
    return recipe_info.map((recipe_info)=> {
        const{
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        } = recipe_info.data;
        return{
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
        };
    });
}

function extractRelevantDetailedRecipeData(recipe_info){
    return recipe_info.map((recipe_info)=> {
        const{
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
            instructions,
            servings,
            extendedIngredients,
        } = recipe_info.data;
        return{
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
            instructions: instructions,
            servings: servings,
            extendedIngredients: extendedIngredients,
        };
    });
}

/**
 * The function extracts information of the recipes IDs that were recieved 
 * @param {} search_response 
 */
function extractSearchResultsIds(search_response){
    let recipes = search_response.data.results;
    recipes_id_list = [];
    recipes.map((recipe)=>{
        console.log(recipe.title);
        recipes_id_list.push(recipe.id);
    });
    return recipes_id_list;
}

/**
 * the function recieves the recipe's ingredients and selects the original topic that holds summary of the ingredients
 * @param {*} relevantRecipeData 
 */
function extractIngredients (relevantRecipeData) {
    let extendedIngredients = relevantRecipeData[0].extendedIngredients;
    ingredients = [];
    extendedIngredients.forEach(ingredient=>{
        ingredients.push(ingredient.original);
    });
    return ingredients;
}

/**
 * 
 * @param {*} recipes_id_list 
 * @param {*} username 
 */
async function getRecipesInfoWithUsername(recipes_id_list,username){

    let promises = [];
    recipes_id_list.map((id)=>
    promises.push(axios.get(`${recipes_api_url}/${id}/information?${api_key}`)));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractRelevantRecipeData(info_response);
    if(username){
       await user_indications.runOnRecipes(username,relevantRecipeData);  
    //await runOnRecipes(username,relevantRecipeData);  
    }
    console.log('relevant recipe data',relevantRecipeData);
    return relevantRecipeData;
}



exports.searchForRecipes = searchForRecipes;
exports.extractQueryParams = extractQueryParams;
exports.getRecipesInfo = getRecipesInfo;
exports.getSingleRecipeInfo = getSingleRecipeInfo;
exports.extractSearchResultsIds = extractSearchResultsIds;
exports.getRecipesInfoWithUsername = getRecipesInfoWithUsername;
