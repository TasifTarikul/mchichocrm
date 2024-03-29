const User = require('./user')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const type = req.body.type

    bcrypt.hash(password, 12)
    .then(hashedPw => {
        const user = new User({
            email:email,
            name: name,
            password: hashedPw,
            type: type
        })

        return user.save();
    })
    .then(result => {
        res.status(201).json({ message: "User created" })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    });
}

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({email: email})
    .then(user =>{
        if(!user){
            const error = new Error('A user with the email could not be found')
            error.statusCode = 401;
            throw error;
        }

        loadedUser = user;
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
        if(!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401
            throw error;
        }

        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id
        }, 'secretkey',
        { expiresIn: '5h'}
        );
        res.status(200).json({
            token: token,
            userId: loadedUser._id.toString()
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.listUser = (req, res, next) => {
    const fltr_by_name = req.query.name;
    const currentPage = req.query.page || 1;
    const limit = req.query.limit || 0;
    const skip = (currentPage -1) * limit;
    let totalUser;
    let totalPages;
    let query = User.find();

    if(fltr_by_name && fltr_by_name!="")
    {
        query = User.find({ name: fltr_by_name });
    }
    
    query.clone().countDocuments()
    .then(count=>{
        totalUser = count;
        return query
        .skip(skip)
        .limit(limit)
    })
    .then(users=>{
        totalPages = (Math.ceil(totalUser/limit) === Infinity)? 1 : Math.ceil(totalUser/limit);
        res
        .status(200)
        .json({
            message: 'Fetched users',
            totalUser: totalUser,
            totalPages: totalPages,
            currentPage: currentPage,
            data: users
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

