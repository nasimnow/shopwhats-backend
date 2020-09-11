const mysqlConnection = require('../../connection');
const express = require('express');
const router = express.Router();

//get all products of current user
router.get('/',(req,res)=>{
    let sql = `SELECT *FROM products WHERE product_user=${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        return res.status(201).json({results})
    })
})

//get specific product
router.get('/:id',(req,res)=>{
    let sql = `SELECT *FROM products WHERE product_id =${req.params.id} AND product_user =${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        return res.status(201).json({results})
    })
})

//add new product
router.post('/',(req,res)=>{
    let product ={product_name:req.body.product_name,product_user:req.user[0].id,product_price:req.body.product_price,product_desc:req.body.product_desc,product_cat:req.body.product_cat}
    let sql = 'INSERT INTO products SET ?'
    let query = mysqlConnection.query(sql,product,(err, result)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Added ${req.body.product_name}`,status: true,login: true}})
    })
})

//update specific product
router.put('/',(req,res)=>{
    let product ={product_name:req.body.product_name,product_price:req.body.product_price,product_desc:req.body.product_desc,product_stock:req.body.product_stock,product_cat:req.body.product_cat}
    let sql = `UPDATE products  SET ? WHERE product_id =${req.body.product_id} AND product_user =${req.user[0].id} `
    let query = mysqlConnection.query(sql,product,(err, result)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Updated ${req.body.product_name}`,status: true,login: true}})
    })
})

//delete specific product
router.delete('/:id',(req,res)=>{
    let sql = `DELETE FROM products  WHERE product_id =${req.params.id} AND product_user =${req.user[0].id} `
    let query = mysqlConnection.query(sql,(err, result)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Deleted `,status: true,login: true}})
    })
})

//flip product stock status
router.get('/stock/:id',(req,res)=>{
    let sql = `UPDATE products  SET product_stock = NOT product_stock WHERE product_id=${req.params.id} AND product_user =${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, result)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Changed Stock Status`,status: true,login: true}})
    })
})

//get all products of a specific catogory
router.get('/catogories/:cat',(req,res)=>{
   
    let sql = `SELECT *FROM products WHERE product_cat =${req.params.cat} AND product_user =${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        return res.status(201).json({results})
    })
})
module.exports = router