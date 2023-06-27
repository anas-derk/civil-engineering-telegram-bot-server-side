const coursesRouter = require("express").Router();

coursesRouter.get("/custom-course-file", (req, res) => {
    const { getCustomCourseFile } = require("../models/courses.model");
    getCustomCourseFile(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = coursesRouter;