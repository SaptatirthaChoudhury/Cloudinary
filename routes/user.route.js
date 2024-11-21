const router = require('express').Router()
const cloudinary = require('../Utils/cloudinary')
const upload = require("../Utils/multer")
const User = require("../model/user.model")

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)

        // Create instance of user
        let user = new User({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id
        });
        // Save user
        await user.save();
        res.json(user)
    } catch (error) {
        console.log(error);
    }
})

router.get("/", async (req, res) => {
    try {
        let user = await User.find()
        res.json(user)
    } catch (error) {
        console.log(error);
    }
})

router.delete("/:id", async (req, res) => {
    try {
        // Find user by id
        let user = await User.findById(req.params.id)
        //Delete image from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id)
        //Delete user from DB
        await user.deleteOne({ _id: user._id })
        res.status(201).send({
            message: "Deleted successfully!"
        })
    } catch (error) {
        console.log(error);
    }
})

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        let user = await User.findById(req.params.id)

        await cloudinary.uploader.destroy(user.cloudinary_id)

        const uploadedInstance = await cloudinary.uploader.upload(req.file.path)

        const updatedData = {
            name: req.body.name || user.name,
            avatar: uploadedInstance.secure_url || user.avatar,
            cloudinary_id: uploadedInstance.public_id || user.cloudinary_id
        }
        user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true })
        res.json(user)
       
    } catch (error) {
        console.log(error);
    }
})



module.exports = router