const lecturesRouter = require("express").Router();

lecturesRouter.get("/custom-lecture-file/:fileId", (req, res) => {
    const { getCustomLectureFile } = require("../models/lectures.model");
    getCustomLectureFile(req.params.fileId).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

lecturesRouter.get("/all-custom-lectures", (req, res) => {
    const { getAllCustomLectures } = require("../models/lectures.model");
    getAllCustomLectures(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = lecturesRouter;