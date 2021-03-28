import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'


// @des       Auth the user & get token
// @route     POST/api/users/login
// @access    Public 
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isADmin: user.isADmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @des       Register a new user
// @route     POST/api/users
// @access    Public 
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('User already exist')
    }

    const user = await User.create({ name, email, password })

    if (user) {
        res.status('201').json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isADmin: user.isADmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @des       Get user profile
// @route     GET/api/users/profile
// @access    Private 
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isADmin: user.isADmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export { authUser, registerUser, getUserProfile }