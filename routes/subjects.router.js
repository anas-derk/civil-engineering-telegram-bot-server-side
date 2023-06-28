const subjectsRouter = require("express").Router();

subjectsRouter.post("/all-subjects", (req, res) => {
    const { postAllSubjects } = require("../models/subjects.model");
    postAllSubjects(req.body.allSubjects).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

subjectsRouter.get("/all-custom-subjects", (req, res) => {
    const { getAllCustomSubjects } = require("../models/subjects.model");
    getAllCustomSubjects(req.query).then((result) => {
        res.json(result);
    }).catch(err => console.log(err));
});

module.exports = subjectsRouter;