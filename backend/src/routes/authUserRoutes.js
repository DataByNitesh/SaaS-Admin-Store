import express from 'express'
import { login, signup } from '../controller/authUser.js'
import { protect } from '../middleware/userMiddleware.js'

const router=express.Router()

router.post('/register',signup)
router.post('/login',login)


router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router