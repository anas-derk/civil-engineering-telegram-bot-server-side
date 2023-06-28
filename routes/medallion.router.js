const medallionsRouter = require("express").Router();

medallionsRouter.get("/custom-medallion-file", (req, res) => {
    const { getCustomMedallionFile } = require("../models/medallion.model");
    getCustomMedallionFile(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

medallionsRouter.get("/all-custom-medallions", (req, res) => {
    const { getAllCustomMedallions } = require("../models/medallion.model");
    getAllCustomMedallions(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = medallionsRouter;