import { getUsersByPollId, getUserByPollIdAndUserId } from "../models/pollAnswer.js";

// Get all participants for a poll
export const getPollUsers = async (req, res) => {
  try {
    const { poll_id } = req.params;
    const users = await getUsersByPollId(poll_id);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get a specific participant for a poll
export const getPollUserById = async (req, res) => {
  try {
    const { poll_id, user_id } = req.params;
    const user = await getUserByPollIdAndUserId(poll_id, user_id);
    if (!user) return res.status(404).json({ success: false, error: "User not found for this poll" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
