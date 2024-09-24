import authUser from "../../model/authModel/authmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const SIGNUP = async (req, res) => {
  try {
    const { username, email, password, phonenumber, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new authUser({
      username,
      email,
      password: hashPassword,
      phonenumber,
      role,
    });
    if (!user) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const newUser = await user.save();
    return res
      .status(200)
      .json({ message: "User Created Successfully", newUser });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Failed To Create User", err });
  }
};

export const SIGNIN = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await authUser.findOne({ email });
    if (!validUser) {
      return res.status(403).json({ message: "Invalid Email" });
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });
    return res
      .status(200)
      .json({ message: "Logged In Successfully", token, validUser });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Wrong Credentials", err });
  }
};

export const GOOGLESIGNIN = async (req, res) => {
  try {
    const user = await authUser.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      return res
        .status(200)
        .json({ message: "Logged In Successfully", token, user });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(generatePassword, 10);
      const newUser = new authUser({
        username: req.body.name.split(" ").join("").toLowerCase(),
        email: req.body.email,
        password: hashPassword,
        profilePicture: req.body.photo,
      });
      const createdUser = await newUser.save();

      const token = jwt.sign({ _id: createdUser._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      return res.status(200).json({
        message: "Logged In Successfully",
        createdUser,
        token,
      });
    }
  } catch (err) {
    console.error("Error during Google SignIn:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const FORGOTPASSWORD = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await authUser.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `Reset your password using this link: http://localhost:5173/resetpassword/${token}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    console.error("Error during password reset:", err);
    return res.status(500).json({ message: "Internal error", err });
  }
};

export const VALIDATE_RESET_TOKEN = async (req, res) => {
  const { token } = req.params;
  try {
    jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ message: "Token is valid" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const RESETPASSWORD = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(password, 10);

    await authUser.updateOne({ _id: decoded.id }, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid token", err });
  }
};

export const UPDATE_PROFILE = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token)
      return res.status(400).json({ status: false, message: "Access Denied" });

    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
      if (err)
        return res
          .status(400)
          .json({ status: false, message: "Invalid Token" });

      const { name, email, phonenumber } = req.body;
      const updatedUser = await authUser.findByIdAndUpdate(
        decode.id,
        { name, email, phonenumber },
        { new: true }
      );

      if (!updatedUser)
        return res
          .status(400)
          .json({ status: false, message: "User not found" });

      const userdata = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phonenumber: updatedUser.phonenumber,
      };

      return res.status(200).json({
        status: true,
        message: "Profile Updated Successfully",
        data: userdata,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

export const DELETE_PROFILE = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token)
      return res.status(400).json({ status: false, message: "Access Denied" });

    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
      if (err)
        return res
          .status(400)
          .json({ status: false, message: "Invalid Token" });

      const deletedUser = await authUser.findByIdAndDelete(decode.id);

      if (!deletedUser)
        return res
          .status(400)
          .json({ status: false, message: "User not found" });

      return res
        .status(200)
        .json({ status: true, message: "Profile Deleted Successfully" });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

export const LOGOUT = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res
      .status(200)
      .json({ status: true, message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};
