const adminRouter = require("express").Router();

adminRouter.post("/add-new-file", (req, res) => {
    const data = req.body;
    switch(data.service) {
        case "medallion": {
            const { addNewFile } = require("../models/medallion.model");
            addNewFile(data).then((result) => {
                res.json(result);
            }).catch(err => console.log(err));
            break;
        }
        case "courses": {
            const { addNewFile } = require("../models/courses.model");
            addNewFile(data).then((result) => {
                res.json(result);
            }).catch(err => console.log(err));
            break;
        }
        case "lectures": {
            const { addNewFile } = require("../models/lectures.model");
            addNewFile(data).then((result) => {
                res.json(result);
            }).catch(err => console.log(err));
            break;
        }
        default: {
            res.json("Error !!");
        }
    }
});

module.exports = adminRouter;