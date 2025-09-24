import { findAllUsers, findUserById } from "../models/user.js";

// GET all users (host sees all answers)
export const getUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// GET one specific user by ID
export const getUserByIdController = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
