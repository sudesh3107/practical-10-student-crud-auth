const express = require("express");

const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All student routes require authentication
router.use(authMiddleware);

// CREATE
router.post("/", async (req, res) => {
  try {
    const { name, email, age, course } = req.body;

    if (!name || !email || !age || !course) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const student = await Student.create({ name, email, age, course });

    res.status(201).json({
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create student"
    });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      data: students
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students"
    });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      data: student
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid student ID"
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update student"
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete student"
    });
  }
});

module.exports = router;
