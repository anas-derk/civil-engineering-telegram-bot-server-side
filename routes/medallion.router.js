const medallionsRouter = require("express").Router();

medallionsRouter.get("/custom-medallions", (req, res) => {
    const { getAllMedallions } = require("../models/medallion.model");
    getAllMedallions(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = medallionsRouter;