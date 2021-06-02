exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        console.log(req.body);

        if(!email || !password){
            return res.status(400).render('login',{
                message: 'Provide email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error,results) =>{
            // console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password)) ){
                res.status(401).render('login',{
                    message:'Email or Password is incorrect.'
                })
            } else{
                req.session.isAuth = true;
                req.session.user = email;
                
                res.status(200).redirect('/');
            }
        })

    } catch(error){
        console.log(error)
    }
}