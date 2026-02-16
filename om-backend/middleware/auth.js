import User from '../models/User.js';

export default async (req, res, next) => {
  const userId = req.header('x-user-id');
  const userRole = req.header('x-user-role');

  if (!userId || !userRole) {
    return res.status(401).json({ msg: 'No user info provided' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ msg: 'Invalid or inactive user' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};