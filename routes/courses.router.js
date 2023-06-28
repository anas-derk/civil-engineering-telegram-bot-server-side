const coursesRouter = require("express").Router();

coursesRouter.get("/custom-course-file/:fileId", (req, res) => {
    const { getCustomCourseFile } = require("../models/courses.model");
    getCustomCourseFile(req.params.fileId).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

coursesRouter.get("/all-custom-courses", (req, res) => {
    const { getAllCustomCourses } = require("../models/courses.model");
    getAllCustomCourses(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = coursesRouter;