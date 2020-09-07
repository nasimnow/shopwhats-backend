const mysqlConnection = require('../../connection');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/',(req,res)=>{
    res.render('register.ejs');
})

router.post('/',async (req,res)=>{
   try {
       hashedPassword = await bcrypt.hash(req.body.password,10);
    let account ={account_phone:req.body.phone,
        account_password:hashedPassword,
    account_store: req.body.storename,account_whatsapp:req.body.phone};
    
    checkUser(req.body.phone,()=>{
        let sql = 'INSERT INTO account SET ?'
        let query = mysqlConnection.query(sql,account,(err,result)=>{
                if(err) res.status(500).json({message:{messageBody :err,status: false}})
                res.status(400).json({message:{messageBody :`Succesfull Created ${req.body.phone}`,status: true}})
        })
    },()=>{
        res.status(301).json({message:{messageBody :`Already Registered`,status: false}})
    })
   } catch (error) {
       
   }

})

function checkUser(phone,addUser,registerd){
    let sql = `SELECT COUNT(*) AS count  FROM account WHERE account_phone=${phone}`
    let count;
    let query = mysqlConnection.query(sql,(err,result)=>{            
        if(result[0].count==0)addUser()
        else registerd()
})  
}

module.exports = router