const lecturesRouter = require("express").Router();

lecturesRouter.get("/all-custom-lectures", (req, res) => {
    const { getAllCustomLectures } = require("../models/lectures.model");
    getAllCustomLectures(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = lecturesRouter;