const DButils = require("./DBUtils");

/**
 * The function adds a recipe to a user's list of lately seen recipes
 * @param {*} username 
 * @param {*} recipeID 
 */
async function addToLastSeen (username, recipeID){
  try{
    //check the favorite doesn't exist
    const users = await DButils.execQuery("SELECT * FROM lastSeen");

    if (users.find((x) => x.username === username && x.food_id == recipeID))
    throw { status: 409, message: "Already in last seen" };
    
    //add the favorite to the DB
    const answer = await (DButils.execQuery(
          `INSERT INTO lastSeen VALUES ('${username}', '${recipeID}')`
     ));
     //return
     } catch (error) {
       return error;
     }
}

/**
 * The function adds a recipe to a user's list of seen recipes
 * @param {} username 
 * @param {*} recipeID 
 */
async function addToSeen (username, recipeID){
  try{
    //check the favorite doesn't exist
    const users = await DButils.execQuery("SELECT * FROM viewedRecipes");

    if (users.find((x) => x.username === username && x.food_id == recipeID))
    throw { status: 409, message: "Already in seen" };
    
    //add the favorite to the DB
    const answer = await (DButils.execQuery(
          `INSERT INTO viewedRecipes VALUES ('${username}', '${recipeID}')`
     ));
     //return
     } catch (error) {
       return error;
     }
}


exports.addToLastSeen = addToLastSeen;
exports.addToSeen = addToSeen;


