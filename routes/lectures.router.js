const lecturesRouter = require("express").Router();

lecturesRouter.get("/custom-lecture-file", (req, res) => {
    const { getCustomLectureFile } = require("../models/lectures.model");
    getCustomLectureFile(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = lecturesRouter;