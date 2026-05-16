const express = require('express');
const complaintController = require('../controllers/complaint.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const upload = require('../middlewares/multer.middleware')

const router = express.Router();


router.post("/create-complaint" , authMiddleware, upload.single('image'),complaintController.createComplaint)
router.get('/get-my-complaints',authMiddleware,complaintController.getMyComplaints)
router.get('/get-all-complaints',authMiddleware,adminMiddleware,complaintController.getAllComplaints);
router.put('/updated-status/:id',authMiddleware,adminMiddleware,complaintController.changeStatus);
router.delete("/delete-complaint/:id",authMiddleware,adminMiddleware,complaintController.deleteComplaint)
    


module.exports = router;
