const DButils = require("./DBUtils");

/**
 * The function updates each recipe's status in match with a specific user
 * @param {*} username 
 * @param {*} recipes_details 
 */
async function runOnRecipes (username,recipes_details){
    let promises = [];
    recipes_details.map((id)=>
    promises.push(updateRecipe(username,id)));
    let info_response = await Promise.all(promises);
    return info_response;
}

/**
 * The function updates a recipe's status in match with a specific user - whether the user has seen it before and if he chose it as a favorite
 * @param {*} username 
 * @param {*} recipe 
 */
async function updateRecipe(username, recipe){
    let isFavorite = await DButils.execQuery(`SELECT * FROM userFavorites WHERE username='${username}' AND food_id=${recipe.id}`);
    if(isFavorite[0]){
      recipe.favorite = true;
    }
    else{
      recipe.favorite = false;
    }
    let isSeen = await DButils.execQuery(`SELECT * FROM viewedRecipes WHERE username='${username}' AND food_id=${recipe.id}`);
    if(isSeen[0]){
        recipe.seen = true;
    }
    else{
        recipe.seen = false;
    }
}

exports.runOnRecipes = runOnRecipes;
