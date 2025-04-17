const UserServices = require('../services/user.services');

// Register controller
exports.register = async (req, res, next) => {
  try {
    console.log("---req body---", req.body);
    const { email, password } = req.body;

    const duplicate = await UserServices.getUserByEmail(email);
    if (duplicate) {
      throw new Error(`User ${email} is already registered`);
    }

    const response = await UserServices.registerUser(email, password);

    res.status(201).json({ status: true, success: 'User registered successfully' });
  } catch (err) {
    console.log("---> err -->", err);
    res.status(400).json({ status: false, message: err.message });

    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    if (!email || !password) {
      throw new Error('Parameters are not correct');
    }

    const user = await UserServices.checkUser(email);
    if (!user) {
      throw new Error('User does not exist');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error('Username or password does not match');
    }

    const tokenData = { _id: user._id, email: user.email };
    const token = await UserServices.generateAccessToken(tokenData, "secret", "1h");

    res.status(200).json({ status: true, success: "Login successful", token });
  } catch (error) {
    console.log("err ---->", error);
    res.status(500).json({ status: false, error: error.message });
  }
};