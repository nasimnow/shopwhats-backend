if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express')
const passport = require('passport')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session')
const flash = require('express-flash')
const cors = require('cors')
const mysqlConnection = require('./connection');
const FileStore = require('session-file-store')(session)

const app = express()

require('./seller/account/passport-config')(passport)
const PORT = process.env.PORT || 3000

app.set('view-engine','ejs')
app.use(express.json())

app.use(cors())
app.use(cors({credentials: 'include',origin: '*'}));
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    genid:(req)=>{
        return uuidv4()
    },
    store:new FileStore(),
    cookie: { maxAge: 172800000 },
    secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session())



app.use('/register',isNotLogin,require('./seller/account/register'));

app.use('/login',isNotLogin, require('./seller/account/login'))

app.use('/products',isLogin,require('./seller/products/products'))


app.get('/logout',isLogin,(req,res)=>{
    req.logOut()
    res.json({message:'succesfull Logggedout',login: false})
})

function isLogin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.status(400).json({message:{messageBody :'Please Login To View',status: false,login: false}})
}
function isNotLogin(req,res,next){
    if(req.isAuthenticated()){
        return res.status(400).json({message:{messageBody :'Already Loginned',status: true,login: true}})
    }
    return next()
}
app.listen(PORT);
