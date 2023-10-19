module.exports = app => {

    const applications = require("../controllers/application.controller.js");
    var router = require("express").Router();

    // Create a new application
    router.post("/", applications.create);

    // Retrieve all applications
    router.get("/", applications.findAll);

    // Retrieve all Problems by userName
    router.get("/userName", applications.findByUserName);

    // Retrieve all application based on the problemId
    router.get("/problemId", applications.findAllByProblemId);

    // Retrieve a single application with id
    router.get("/:id", applications.findOne);

    // Update a application with id
    router.put("/:id", applications.update);

    // Delete a application with id
    router.delete("/:id", applications.delete);

    //Delete all applications
    router.delete("/", applications.deleteAll);

    app.use('/api/applications', router);
};