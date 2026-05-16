const complaintModel = require("../models/complaint.model");

const uploadImage = require("../storage/storage.services");

async function createComplaint(req, res) {
  try {
    const { title, description, location, category } = req.body;
    let imageUrl = null;

    console.log(req.file);
    if (req.file) {
      try {
        const result = await uploadImage(req.file.buffer);
        console.log(result);
        imageUrl = result.url;
      } catch (err) {
        console.log("problem in uploading image", err);
       return res.status(500).json({
          message: "image didnt get uploaded",
        });
      }
    }   
     const complaint = await complaintModel.create({
      title,
      description,
      location,
      category,
      createdBy: req.user.id,
      image: imageUrl,
    });
    res.status(201).json({
      message: "complaint created successfully",
      complaint,
    });
  } catch (err) {
        console.log("create complaint error:", err.message); // yeh add karo

    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
}

async function getMyComplaints(req, res) {
  try{
  const myComplaints = await complaintModel.find({ createdBy: req.user.id });
  res.status(200).json({
    message: "my complaints",
    myComplaints,
  });
}
  catch(err){
res.status(500).json({
  message:"server error ", error: err.message
})
  }
}

async function getAllComplaints(req, res) {
  try{
  const allComplaints = await complaintModel.find();
  res.status(200).json({
    message: "complaints fetch successfully",
    allComplaints,
  });
}catch(err){
res.status(500).json({
  message:"server error", error: err.message
})
}
}

async function changeStatus(req, res) {
  try{
  const { id } = req.params;

  const { status } = req.body;

  const allowdStatus = ["pending", "in-progress", "resolved"];
  if (!allowdStatus.includes(status)) {
    return res.status(400).json({
      message: "invalid status value",
    });
  }
  const updatedStatus = await complaintModel.findByIdAndUpdate(
    id,
    {
      status,
    },
    { new: true },
  );

  res.status(200).json({
    message: "status updated successfully",
    updatedStatus,
  });
}catch(err){
  res.status(500).json({
    message:"server error", error:err.message
  })
}
}

async function deleteComplaint(req, res) {
  try{
  const { id } = req.params;

  const complaint = await complaintModel.findById(id);
  if (!complaint) {
    return res.status(404).json({
      message: "complaint not found",
    });
  }
  if (complaint.status !== "resolved") {
    return res.status(400).json({
      message: "only resolved complaints can be deleted",
    });
  }
  await complaintModel.findByIdAndDelete(id);
  res.status(200).json({
    message: "complaint deleted successfully",
  });
}catch(err){
  res.status(500).json({
    message:"server error",error:err.message
  })
}
}

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  changeStatus,
  deleteComplaint,
};
