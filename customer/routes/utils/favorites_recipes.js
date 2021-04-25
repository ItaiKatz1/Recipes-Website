const DButils = require("./DBUtils");

  /**
   * The function receieves a recipe to add to a user's list of favorite recipes
   * @param {*} username 
   * @param {*} recipeID 
   */
  async function addFavorites (username, recipeID){
    //check the favorite doesn't exist
    const users = await DButils.execQuery("SELECT * FROM userFavorites");

    if (users.find((x) => x.username === username && x.food_id == recipeID))
      throw { status: 409, message: "Already in favorite" };
    
    //add the favorite to the DB
    const answer = await (DButils.execQuery(
        `INSERT INTO userFavorites VALUES ('${username}', '${recipeID}')`
      ));
  }

  /**
   * The function recieve's details to add to a user's recipe in the favorites table
   * @param {*} username 
   * @param {*} recipes_details 
   */
  async function addFavoritesDetails(username, recipes_details){
    if(username){
      await user_indications.runOnRecipes(username,recipes_details); 
    }
  }

  exports.addFavorites = addFavorites;
  exports.addFavoritesDetails = addFavoritesDetails;
