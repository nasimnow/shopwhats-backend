const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mysqlConnection = require('../../connection')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField:'phone'},(phone, password,done)=>{
            let query = `SELECT * FROM account WHERE account_phone ='${phone}'`
            mysqlConnection.query(query,async(err,user)=>{
                if(err) {
                    return done(null,false)
                }
            
                if(user!=''){
                    if(await bcrypt.compare(password ,user[0].account_password)){
                            console.log('settt')
                            return done(null,user)
                    }
                    else{
                        return done(null,false)
                    }
                    
                }
                else{
                    return done(null,false,{message: 'This Account Dosent Exist'})
                }
                
               
            })
        }))

passport.serializeUser((user,done)=>{
    done(null, user[0].id)
})

passport.deserializeUser((id, done )=>{
    let query = `SELECT * FROM account WHERE id ='${id}'`
    mysqlConnection.query(query,(err,user)=>{
        done(err, user)
    })
})

}