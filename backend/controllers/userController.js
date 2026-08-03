const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

// Generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Signup
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, subscription } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = generateCode();

    await sendEmail(email, "Verify Your Account", `Your code is: ${code}`);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode: code,
      subscription: subscription,
    });

    res.status(201).json({
      message: "User created. Verification code sent to email",
      userId: newUser._id,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify email
exports.verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Invalid code" });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Admin Login (from .env)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin", email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          id: null,
          email,
          name: "Admin",
          role: "admin",
        }
      });
    }

    // Normal User Login
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify your email first" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: "user",
      },
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};


// Get User
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateUserById = async (req, res) => {
  try {
    const { name, email, password, subscription } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.subscription = subscription || user.subscription;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user status only
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Forgot Password: send OTP to email ──
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with that email" });

    // Reuse the verificationCode field for the reset OTP
    const code = generateCode();
    user.verificationCode = code;
    await user.save();

    await sendEmail(
      email,
      "Reset Your Dream Voice Password",
      `Your password reset code is: ${code}\n\nThis code is valid for 15 minutes. Do not share it with anyone.`
    );

    res.status(200).json({ message: "Password reset code sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Reset Password: verify OTP and set new password ──
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password)
      return res.status(400).json({ message: "Email, code, and new password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Invalid or expired reset code" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.verificationCode = null; // clear OTP after use
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
