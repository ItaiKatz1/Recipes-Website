const users_db = require("./DBUtils.js");

/**
 * function to retrieve a specific user's own recipe 
 * @param {*} username 
 * @param {*} ID 
 */
async function getFamilyRecipe(username, ID) {
    try{
        const recipe = await users_db.execQuery(`SELECT * FROM familyRecipes WHERE username = '${username}' AND recipe_id = '${ID}'`);
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
async function getAllFamilyRecipes(username) {
    const user_recipes = await users_db.execQuery(`SELECT title, readyInMinutes, relative, event_made, image_url, extendedIngredients, instructions, servings FROM familyRecipes WHERE username = '${username}'`)
    return(user_recipes);
}


exports.getFamilyRecipe = getFamilyRecipe;
exports.getAllFamilyRecipes = getAllFamilyRecipes;