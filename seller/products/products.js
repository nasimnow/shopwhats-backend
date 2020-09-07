const mysqlConnection = require('../../connection');
const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
   
    let sql = `SELECT *FROM products WHERE product_user=${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        return res.status(201).json({results})
    })
})
router.post('/',(req,res)=>{
    let product ={product_name:req.body.product_name,product_user:req.user[0].id}
    let sql = 'INSERT INTO products SET ?'
    let query = mysqlConnection.query(sql,product,(err, result)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Added ${req.body.product_name}`,status: true,login: true}})
    })
})

module.exports = router