const jwt  = require('jsonwebtoken');
const keys   = require('../../config/keys');
const Joi = require('joi');
const authentication = require('../helpers/authentication');
//importing model
const Book = require('../models/book');

module.exports = function(app, db){

	app.post('/books/add', authentication.ensureToken, (req, res) => {
		//Joi Schema
		const employee_schema = Joi.object().keys({
			name: Joi.string().required(),
            author: Joi.string().required(),
            publisher: Joi.string().required(),
            image: Joi.string().required(),
            isbn: Joi.string().required(),
            pages: Joi.number().required(),
            quantity: Joi.number().required()
		});

        //verifying token
        jwt.verify(req.token, keys.secret_key, (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{
                //only allow employees to add books
                if(authData.type !== "employee")
                    res.sendStatus(403);

                //console.log("authData : "+authData.username, authData.type);
                //validating request
                //console.log(req.body);
                Joi.validate(req.body, employee_schema, function (err, value) { 
                    if(err)
                        res.status(400).json({
                            'message': err.details[0].message
                        })
                    else{
                        const book = new Book({
                            name: req.body.name,
                            author: req.body.author,
                            publisher: req.body.publisher,
                            isbn: req.body.isbn,
                            pages:req.body.pages,
                            quantity:req.body.quantity,
                            modified_date:Date.now()
                        });
                        //saving new book
                        book.save().then(result => {
                            console.log(result);
                            res.json(
                                result
                            )
                        }).catch(err => {
                            if(err.code == 11000){
                                res.status(400).json({
                                    'message': "Book with given 'name' already exitsts"
                                });
                            }else{
                                res.status(400).json(err.message);
                            }
                            console.log(err);
                        });
                    }
                });
            }
        });
    });

    app.post('/students/search', authentication.ensureToken, (req, res) => {
		//Joi Schema
		const employee_schema = Joi.object().keys({
			query: Joi.string().required() //name or scholar number
		});

        //verifying token
        jwt.verify(req.token, keys.secret_key, (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{
                //only allow employees to add books
                if(authData.type !== "employee")
                    res.sendStatus(403);

                console.log("authData : "+authData.username, authData.type);
                //validating request
                console.log(req.body);
                Joi.validate(req.body, employee_schema, function (err, value) { 
                    if(err)
                        res.status(400).json({
                            'message': err.details[0].message
                        })
                    else{
                        //return the results aongiwht pagination id

                        res.json(
                            req.body
                        )
                    }
                });
            }
        });
    });
    
    app.post('/books/issue', authentication.ensureToken, (req, res) => {
		//Joi Schema
		const employee_schema = Joi.object().keys({
            book_id: Joi.string().required(),
            scholar_number: Joi.string().required()
		});

        //verifying token
        jwt.verify(req.token, keys.secret_key, (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{
                //only allow employees to add books
                if(authData.type !== "employee")
                    res.sendStatus(403);

                console.log("authData : "+authData.username, authData.type);
                //validating request
                console.log(req.body);
                Joi.validate(req.body, employee_schema, function (err, value) { 
                    if(err)
                        res.status(400).json({
                            'message': err.details[0].message
                        })
                    else{
                        //check if book is available
                        //decrese book availability count
                        //allot given book to the student
                        //return the student details
                        res.json(
                            req.body
                        )
                    }
                });
            }
        });
    });

}