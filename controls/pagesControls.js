const User = require("../models/users");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const getHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
  }
};

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, fullName } = req.body;

    const newUser = new User({ userName, email, password, fullName });

    const token = jwt.sign(
      { userId: newUser._id, userName, email },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { userId: newUser._id, userName },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
    );

    newUser.token = token;
    newUser.refresh = refreshToken;

    const registerUser = await User.create(newUser);
 
    res.status(200).json({
      message: "Registration User Success",
    //   User: registerUser,
      token,
      refreshToken
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, userName, email: user.email },
      process.env.SECRET_KEY,
      {expiresIn: "15m"}
    );
    const refreshToken = jwt.sign(
        { userId: user._id, userName },
        process.env.SECRET_KEY,
        {expiresIn: "1d"}
    );

    const userUpdate = await User.findOneAndUpdate(
      { userName },
      { $set: { token, refresh: refreshToken } },
      { new: true }
    );

    res.status(200).json({
      message: "Login Success",
      User: userUpdate,
    });
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    const verify = req.jwt

    const user = await User.findOneAndUpdate(
      { userName: verify.userName },
      { $set: { token: null } }
    );

    res.status(200).json({
      message: "Logout Success",
      userId: verify.userId,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error,
    });
  }
};

const profileUser = async (req, res) => {
  try {
    const verify = req.jwt

    const user = await User.findOne({ userName: verify.userName });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      message: "Profile Success",
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const verify = req.jwt

    let user = await User.findOne({ userName: verify.userName });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const newToken = jwt.sign(
        { userId: user._id, userName: user.userName, email: user.email },
        process.env.SECRET_KEY,
        {expiresIn: '15m'}
    );
    const refreshToken = jwt.sign(
        { userId: user._id, userName: user.userName },
        process.env.SECRET_KEY,
        {expiresIn: '1d'}
    );

    user = await User.findOneAndUpdate({ userName: user.userName }, { $set: { token: newToken, refreshToken } })

    res.status(200).json({
      message: "Profile Success",
      token: newToken,
      refreshToken,
      user
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error,
    });
  }
};

module.exports = {
  getHome,
  registerUser,
  loginUser,
  logoutUser,
  profileUser,
  refreshToken
};
