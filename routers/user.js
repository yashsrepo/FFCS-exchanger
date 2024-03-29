const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()
router.get('/users/dashboard',auth, (req, res) => {
    try{console.log(req.user)
        const userData = {
            regno: req.body.regno,
            contact: '1234567890',
            email: 'example@example.com'
        };
        res.render('profile.ejs',{ userData: req.user })
    }
        
    
    catch{
        res.redirect('/users/login');
    }
  });
  router.get('/',(req,res)=>{
    console.log(req.cookies)

    
    res.render('home.ejs')
  })
  router.get('/users',(req,res)=>{
    

    
    res.render('register.ejs')
  })
  
  

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        console.log(req.body)
        await user.save()
        const token = await user.generateAuthToken()
       
        const options={
            maxAge:120000000,
            httpOnly:true
        }
        res.cookie('auth_token', token, {
            expires: new Date(Date.now() + 3600000), // Expires in 1 hour
            httpOnly: true, // This prevents client-side JavaScript from accessing the cookie
            secure: true // This ensures the cookie is only sent over HTTPS
            // You might need to adjust the 'secure' option based on your deployment environment
        });
        console.log("user")
       
        res.redirect('/users/dashboard');
        
    } catch (e) {
        res.redirect('/users/');
    }
})
router.get('/users/login', (req, res) => {
    res.render('login.ejs')
  });

router.post('/users/login', async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        console.log("sdfsf")
        const options={
            expires: new Date(Date.now  +3600000)
        }
        res.cookie('auth_token', token, {
            expires: new Date(Date.now() + 3600000), // Expires in 1 hour
            httpOnly: true, // This prevents client-side JavaScript from accessing the cookie
            secure: true // This ensures the cookie is only sent over HTTPS
            // You might need to adjust the 'secure' option based on your deployment environment
        });
       
        res.redirect('/users/dashboard');
    } catch (e) {
        res.redirect('/users/login');
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req, res) => {
    console.log(req.user)
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'regno']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router