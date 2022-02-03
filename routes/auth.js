const router = require("express").Router();
// const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

//REGISTER
router.post("/register", async (req, res) => {
	const {userId, password}= {
		userId : req.body.userId,
		password: CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString()
	}
	try {
		const savedUser = await prisma.user.create({
			data:{
				userId,
				password
			},
			select:{
				userId: true
			}
		});
		console.log(savedUser);
		res.status(201).json(savedUser);
	} catch (err) {
		console.error(err);
		next(err);
		// res.status(500).json(err);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where:{
				userId: req.body.userId
			},
			select: {
				id:true,
				userId:true,
				password:true
			}
		})
		console.log(user);
		if (user === null) {
			const error = new Error(`There is no user whose name is ${req.body.userid}`)
			// res
			// 	.status(401)
			// 	.json("There is no user whose name is " + req.body.username);
		}

		const decrypted = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
		const Originalpassword = decrypted.toString(CryptoJS.enc.Utf8);
		console.log(Originalpassword)
		if (Originalpassword !== req.body.password) {
			res.status(401).json("Wrong Credentials");
		} else {
			const accessToken = jwt.sign(
				{
					id: user.id,
					user_id: user.userId
				},
				process.env.JWT_SEC,
				{ expiresIn: "3d" }
			);
			const { password, ...others } = user;
			res.status(200).json({ ...others, accessToken });
		}
	} catch (err) {
		console.error
		res.status(500).json(err);
	}
});

module.exports = router;
