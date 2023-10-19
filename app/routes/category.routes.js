module.exports = app => {
    const categories = require("../controllers/category.controller.js");
    var router = require("express").Router();
  
    // Create a new Problem
    router.post("/", categories.create);
  
    // Retrieve all Problems
    router.get("/", categories.findAll);   
  
    // Retrieve a single Problem with id
    router.get("/:id", categories.findOne);
  
    // Update a problem with id
    router.put("/:id", categories.update);
  
    // Delete a problem with id
    router.delete("/:id", categories.delete);
  
    // Delete all problems
    router.delete("/", categories.deleteAll);
    
    app.use('/api/categories', router);
  };