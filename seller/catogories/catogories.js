const mysqlConnection = require('../../connection');
const express = require('express');
const router = express.Router();

//get all catogories of current user
router.get('/',(req,res)=>{
    let sql = `SELECT *FROM catogories WHERE cat_user=${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        return res.status(201).json({results})
    })
})

//get specific catogories by id
router.get('/:id',(req,res)=>{
    let sql = `SELECT *FROM catogories WHERE id=${req.params.id} AND cat_user=${req.user[0].id}`
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        return res.status(201).json({results})
    })
})

router.delete('/:id',(req,res)=>{
    let sql = `DELETE FROM catogories  WHERE id =${req.params.id} AND cat_user =${req.user[0].id} `
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Deleted `,status: true,login: true}})
    })
})
router.post('/',(req,res)=>{
    let cat ={cat_name:req.body.cat_name,cat_user:req.user[0].id}
    let sql = 'INSERT INTO catogories SET ?'
    let query = mysqlConnection.query(sql,cat,(err, result)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Added ${req.body.cat_name}`,status: true,login: true}})
    })
})

router.put('/',(req,res)=>{
    let cat ={cat_name:req.body.cat_name}
    let sql = `UPDATE catogories SET ? WHERE id=${req.body.id}`
    let query = mysqlConnection.query(sql,cat,(err, result)=>{
        if(err) return res.status(500).json({message:{messageBody :err,status: false}})
        res.status(201).json({message:{messageBody :`Succesfully Updated ${req.body.cat_name}`,status: true,login: true}})
    })
})

module.exports = router