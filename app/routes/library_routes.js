const jwt  = require('jsonwebtoken');
const keys   = require('../../config/keys');
const Joi = require('joi');
const authentication = require('../helpers/authentication');

const Employee = require('../models/employee');
const Student = require('../models/student');
const Book = require('../models/book');

module.exports = function(app, db){
	app.post('/login/student', (req, res) => {
		
		var header=req.headers['authorization']||'',        // get the header
		token=header.split(/\s+/).pop()||'',            // and the encoded auth token
		auth=new Buffer(token, 'base64').toString(),    // convert from base64
		parts=auth.split(/:/),                          // split on colon
		username=parts[0],
		password=parts[1];

	
	if( !username || !password || username.trim() == "" || password.trim() == ""){
		res.status(404).json({
			'message': 'Username or Password cannot be empty'
		});
	}
	else{
			Student.findOne({'student_id': username, 'password': password}, function (err, student) {
			
				if(err){
					res.status(500).send({
						'message': 'Internal Database Error'
					})
				}
				
				console.log(username, password, student);

				if (student == null){
					res.status(404).json({
						'message': 'Username or Password Incorrect'
					});
				}else{               
					//user exists, return JWT
					jwt.sign({"username":username, type:"student"}, keys.secret_key, (err, token) => {
						res.json({
							token
						})
					});
				}
			})
		}

	});

	app.post('/login/employee', (req, res) => {
		
		var header=req.headers['authorization']||'',        // get the header
			token=header.split(/\s+/).pop()||'',            // and the encoded auth token
			auth=new Buffer(token, 'base64').toString(),    // convert from base64
			parts=auth.split(/:/),                          // split on colon
			username=parts[0],
			password=parts[1];

		
		if( !username || !password || username.trim() == "" || password.trim() == ""){
			res.status(404).json({
				'message': 'Username or Password cannot be empty'
			});
		}
		else{
			Employee.findOne({'employee_id': username, 'password': password}, function (err, employee) {
			
				if(err){
					res.status(500).send({
						'message': 'Internal Database Error'
					})
				}
				
				if (employee == null){
					res.status(404).json({
						'message': 'Username or Password Incorrect'
					});
				}else{                
					//user exists, return JWT
					jwt.sign({"username":username, type:"employee"}, keys.secret_key, (err, token) => {
						res.json({
							token
						})
					});
				}
			})
		}
	});

	app.post('/register/student', (req, res) => {
		//Joi Schema
		const student_schema = Joi.object().keys({
			student_id: Joi.string().required(),
			name: Joi.string().min(3).max(30).required(),
			email: Joi.string().email().required(),
			mobile: Joi.string().required(),
			course: Joi.string().required(),
			branch: Joi.string().required(),
			semester: Joi.number().min(1).max(10).required(),
			image: Joi.string().required(),
			password: Joi.string().required()
		});

		//validating request
		Joi.validate(req.body, student_schema, function (err, value) { 
			console.log(err);
			if(err)
				res.status(400).json({
					'message': err.details[0].message
				})
			else{	
					const student = new Student({
						student_id: req.body.student_id,
						name: req.body.name,
						email: req.body.email,
						mobile: req.body.mobile,
						course: req.body.course,
						branch: req.body.branch,
						semester: req.body.semester,
						image: req.body.image,
						password: req.body.password
					});

					//saving new employee record
					student.save().then(result => {
						res.json(
							result
						)
					}).catch(err => {
						if(err.code == 11000){
							res.status(400).json({
								'message': "Student with given 'scholar_number' already exitsts"
							});
						}else{
							res.status(400).json({
								'message': err.message
							});
						}
					});
			}
		});
	});

	app.post('/register/employee', (req, res) => {
		//Joi Schema
		const employee_schema = Joi.object().keys({
			employee_id: Joi.string().alphanum().required(),
			name: Joi.string().min(3).max(30).required(),
			email: Joi.string().email().required(),
			mobile: Joi.string().required(),
			image: Joi.string().required(),
			password: Joi.string().required()
		});

		//validating request
		Joi.validate(req.body, employee_schema, function (err, value) { 
			if(err)
				res.status(400).json({
					'message': err.details[0].message
				})
			else{
				const employee = new Employee({
					employee_id: req.body.employee_id,
					name: req.body.name,
					email: req.body.email,
					mobile: req.body.mobile,
					image: req.body.image,
					password: req.body.password
				});

				//saving new employee record
				employee.save().then(result => {
					console.log(result);
					res.json(
						result
					)
				}).catch(err => {
					if(err.code == 11000){
						res.status(400).json({
							'message': "Employee with given 'employee_id' already exitsts"
						});
					}else{
						res.status(400).json({
							'message': err.message
						});
					}
				});
			}
		});
	});

	app.get('/books', authentication.ensureToken, (req, res) => {

        //verifying token
        jwt.verify(req.token, keys.secret_key, (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{
				Book.find()
				.exec()
				.then(books => {
					res.json(books);
				})
				.catch(err => {
					res.status(500).json({
						'message': err.message
					})
				});   
            }
        });
		
	});

	app.post('/books/search', authentication.ensureToken, (req, res) => {
		//Joi Schema
		const employee_schema = Joi.object().keys({
			query: Joi.string().required()
		});

        //verifying token
        jwt.verify(req.token, keys.secret_key, (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{

                console.log("authData : "+authData.username, authData.type);
                //validating request
                console.log(req.body);
				
				Joi.validate(req.body, employee_schema, function (err, value) { 
                    if(err)
                        res.status(400).json({
                            'message': err.details[0].message
                        })
                    else{
						//return the search results for books from databse alongwith paginatin id
                        res.json({
                            "results": []
						})
                    }
                });
            }
        });
		
    });
	
}