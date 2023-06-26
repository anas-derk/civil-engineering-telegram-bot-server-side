const lecturesRouter = require("express").Router();

lecturesRouter.get("/custom-lectures", (req, res) => {
    const { getAllLectures } = require("../models/lectures.model");
    getAllLectures(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = lecturesRouter;