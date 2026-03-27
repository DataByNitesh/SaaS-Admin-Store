import express from 'express'
import {
    getalluser,
    createUser,
    toggleblocker,
    deleteUser,
    toggleUserRole
} from "../controller/user.controller.js"

import { protect,authorize } from '../middleware/userMiddleware.js'

const router=express.Router()

router.get('/',protect,authorize("admin"),getalluser)
router.patch('/:id/block',protect,authorize("admin"),toggleblocker)
router.delete('/:id',protect,authorize("admin"),deleteUser)
router.patch("/:id/role", protect, authorize("admin"), toggleUserRole);
router.post("/", protect, authorize("admin"), createUser);

export default router