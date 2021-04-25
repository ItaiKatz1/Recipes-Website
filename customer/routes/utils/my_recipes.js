const users_db = require("./DBUtils.js");

/**
 * function to retrieve a specific user's own recipe with more information
 * @param {*} username 
 * @param {*} ID 
 */
async function getMyRecipe(username, ID) {
    try{
        const recipe = await users_db.execQuery(`SELECT * FROM myRecipes WHERE username = '${username}' AND id = '${ID}'`);
        return(recipe);
    } catch (error) {
        console.log(error);
        return(error);
    }
}
/**
 * function to retrieve all of the user's recipes from the DB
 * @param {*} username 
 */
async function getAllMyRecipes(username) {
    const user_recipes = await users_db.execQuery(`SELECT id, title, readyInMinutes, aggregateLikes, vegetarian, vegan, glutenFree, image FROM myRecipes WHERE username = '${username}'`)
    return(user_recipes);
}


exports.getMyRecipe = getMyRecipe;
exports.getAllMyRecipes = getAllMyRecipes;