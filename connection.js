const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: "us-cdbr-east-02.cleardb.com",
    user: "bf04310140ea86",
    password: "bdd503d0",
    database: "heroku_377dc08c48ea374",
    multipleStatements: true
})
mysqlConnection.connect((err)=>{
    if(!err){
        console.log("Connected");
    }else{
        console.log('fAILED')
    }
})
module.exports = mysqlConnection;