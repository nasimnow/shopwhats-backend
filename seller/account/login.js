
const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/',(req,res)=>{
  res.render('login.ejs')
})

router.post('/', (req, res)=>{
  passport.authenticate('local', (err, user, info)=> {
    if (err) { return next(err) }
    if (!user) { return res.status(400).json({message:{messageBody :"Check YOur Username or Password",status: false}}) }
    req.logIn(user, (err)=> {
      if (err) { return next(err) }
      
      res.status(201).json({message:{messageBody :`Login Successfull ${req.user[0].account_phone}`,status: true,login: true}})
    })
  })(req, res)
})

  module.exports = router