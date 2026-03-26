const user = require("../models/usermodel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const team = require("../models/teammodel.js")

const registeruser = async (req, res) => {
    try {
        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }
        const stablepassword = await bcrypt.genSalt(10);
        const passwordtrue = await bcrypt.hash(req.body.password, stablepassword)
        const registeruserdata = {
            name: req.body.name,
            email: req.body.email,
            password: passwordtrue
        };
        const data = await user.create(registeruserdata);
        if (data) {
            res.status(201).json({
                message: "you got your result as success",
                success: true
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "not abe to register the user ",
            error: error.message,
            success: false
        });
    }
}
const loginuser = async (req, res) => {
    try {
        const data = await user.findOne({
            name: req.body.name,
        });
        if (!data) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        const realpassword = await bcrypt.compare(req.body.password, data.password);
        if (!realpassword) {
            return res.status(404).json({
                message: "password invalid",
                success: false
            })
        }
        const userteaminfo = await team.findOne({ "members.user": data._id });
        const memberEntry = userteaminfo ? userteaminfo.members.find(
            m => m.user.toString() === data._id.toString()
        ) : null;

        const token = jwt.sign(
            { id: data._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        if (token)
            console.log(token);
        else {
            console.log('token is not generated')
        }
        res.status(201).json({
            messsage: "you are logged succesfully",
            success: true,
            token: token,
            userId: data._id,
            teamId: userteaminfo?._id || null,   // ✅ added
            teamName: userteaminfo?.name || null, // ✅ fixed casing
            role: memberEntry?.role || null
        })

    } catch (error) {
        res.status(500).json({
            message: "not abe to register the user ", error,
            success: false
        });
    }
}


module.exports = {
    registeruser,
    loginuser
}