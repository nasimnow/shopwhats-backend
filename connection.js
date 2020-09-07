const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shopwhats",
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