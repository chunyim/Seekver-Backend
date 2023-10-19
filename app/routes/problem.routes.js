
module.exports = app => {

    const problems = require("../controllers/problem.controller.js");
    var router = require("express").Router();

    // Create a new problem 
    router.post("/", problems.create);

    // Retrieve all Problems
    router.get("/", problems.findAll);

    // Retrieve all Problems by seekerName
    router.get("/bySeekerName", problems.findBySeekerName);

    // Retrieve a single Problems with id
    router.get("/:id", problems.findOne);

    // Update a Problems with id
    router.put("/:id", problems.update);

    // Delete a Problems with id
    router.delete("/:id", problems.delete);

    //Delete all Problems
    router.delete("/", problems.deleteAll);

    app.use('/api/problems', router);
};