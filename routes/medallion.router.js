const medallionsRouter = require("express").Router();

medallionsRouter.get("/custom-medallion-file", (req, res) => {
    const { getCustomMedallionFile } = require("../models/medallion.model");
    getCustomMedallionFile(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

medallionsRouter.get("/all-medallions", (req, res) => {
    const { getAllMedallions } = require("../models/medallion.model");
    getAllMedallions().then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = medallionsRouter;