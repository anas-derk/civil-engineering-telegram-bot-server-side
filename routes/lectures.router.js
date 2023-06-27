const lecturesRouter = require("express").Router();

lecturesRouter.get("/all-lectures", (req, res) => {
    const { getAllLectures } = require("../models/lectures.model");
    getAllLectures().then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = lecturesRouter;