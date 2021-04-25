require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.tedious_userName,
  password: process.env.tedious_password,
  server: process.env.tedious_server,
  database: process.env.tedious_database,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

/**
 * The function recieves a username and returns its matching image URL from the system
 * @param {*} username 
 */
async function getUserImage(username) {
  const user_image = await execQuery(`SELECT image_url FROM users WHERE username = '${username}'`)
  return(user_image);
}

async function execQuery(query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

exports.getUserImage = getUserImage;
exports.execQuery = execQuery;