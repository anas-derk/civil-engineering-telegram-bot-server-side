const coursesRouter = require("express").Router();

coursesRouter.get("/custom-courses", (req, res) => {
    const { getAllCourses } = require("../models/courses.model");
    getAllCourses(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = coursesRouter;