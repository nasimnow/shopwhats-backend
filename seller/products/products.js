const mysqlConnection = require('../../connection');
const express = require('express');
const router = express.Router();
const fs = require('fs')
const multer = require('multer')

//get all products of current user
router.get('/',(req,res)=>{
    let sql=`SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE product_user=${req.user[0].id}
    GROUP BY products.id`
    //let sql = `SELECT *FROM products WHERE product_user=${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        return res.status(200).json({status:true,login:true,data:results})
    })
})

//get specific product
router.get('/:id',(req,res)=>{
    let sql=`SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE products.id =${req.params.id} AND products.product_user =${req.user[0].id}
    GROUP BY products.id`
    //let sql = `SELECT *FROM products WHERE id =${req.params.id} AND product_user =${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({status:false,error:{message :err}})
        return res.status(200).json({status:true,login:true,data:results})
    })
})

//add new product
router.post('/',(req,res)=>{
    let product ={product_name:req.body.product_name,product_user:req.user[0].id,product_price:req.body.product_price,product_desc:req.body.product_desc,product_cat:req.body.product_cat}
    let sql = 'INSERT INTO products SET ?'
    let query = mysqlConnection.query(sql,product,(err, result)=>{
        if(err) return res.status(500).json({status:false,error:{message :err}})
        return res.status(201).json({status:true,login:true,data:product})
    })
})

//update specific product
router.put('/',(req,res)=>{
    let product ={product_name:req.body.product_name,product_price:req.body.product_price,product_desc:req.body.product_desc,product_stock:req.body.product_stock,product_cat:req.body.product_cat}
    let sql = `UPDATE products  SET ? WHERE id =${req.body.id} AND product_user =${req.user[0].id} `
    let query = mysqlConnection.query(sql,product,(err, result)=>{
        if(err) return res.status(500).json({status:false,error:{message :err}})
        return res.status(201).json({status:true,login:true,data:product})
    })
})

//delete specific product
router.delete('/:id',(req,res)=>{
    let sql = `DELETE FROM products  WHERE id =${req.params.id} AND product_user =${req.user[0].id} `
    let query = mysqlConnection.query(sql,(err, result)=>{
        if(err) return res.status(500).json({status:false,error:{message :err}})
        return res.status(201).json({status:true,login:true,data:{id:req.params.id}})    
    })
})

//flip product stock status
router.put('/stock/:id',(req,res)=>{
    let sql = `UPDATE products  SET product_stock = NOT product_stock WHERE id=${req.params.id} AND product_user =${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, result)=>{
        if(err) return res.status(500).json({status:false,error:{message :err}})
        return res.status(201).json({status:true,login:true,data:{id:req.params.id}})    
    })
})

//get all products of a specific catogory
router.get('/catogories/:cat',(req,res)=>{
    let sql=`SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE products.product_cat =${req.params.cat} AND products.product_user =${req.user[0].id}
    GROUP BY products.id`
   // let sql = `SELECT *FROM products WHERE product_cat =${req.params.cat} AND product_user =${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({status:false,error:{message :err}})
        return res.status(200).json({status:true,login:true,data:results})
    })
})

//get no of products under a catogory
router.get('/catogories/no/:cat',(req,res)=>{
   
    let sql = `SELECT COUNT(*) AS count FROM products WHERE product_cat =${req.params.cat} AND product_user =${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({status:false,error:{message :err}})
        return res.status(200).json({status:true,login:true,data:{products_count:results[0].count}})
    })
})

let storage = multer.diskStorage({
    destination: function(req,res,callback){
        let dir ='./images'
        if(!fs.existsSync(dir))
        {
            fs.mkdirSync(dir)
        }
        callback(null,dir)
    },
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})
 
let upload = multer({ storage: storage}).array('product_image',6)

router.post('/imageupload',(req,res,next)=>{
    upload(req,res,function(err){
        if(err) return res.status(500).json({status:false,error:{message :err}})
        res.send('upload Finished')
    })
})

module.exports = router