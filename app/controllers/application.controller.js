const db = require("../models");
const Applications = db.applications;

// Create and Save a new Application
exports.create = (req, res) => {
  // Validate request
  if (!req.body.userName) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create an application
  const application = new Applications({
    problemId: req.body.problemId,
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    applicationDate: req.body.applicationDate,
    message: req.body.message,
    contactMethod: req.body.contactMethod,
    contact: req.body.contact,
  });

  // Save application in the database
  Applications.create(application)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the application.",
      });
    });
};

// Retrieve all application from the database.
exports.findAll = (req, res) => {
    const userName = req.query.userName;
   var condition = userName ? { userName: { $regex: new RegExp(userName), $options: "i" } } : {};
   Applications.find(condition)
     .then(data => {
       res.send(data);
     })
     .catch(err => {
       res.status(500).send({
         message:
           err.message || "Some error occurred while retrieving applications."
       });
     });
 };

exports.findAllByProblemId = (req, res) => {
  const problemId = req.query.problemId;
  // var condition = userName
  //   ? { userName: { $regex: new RegExp(userName), $options: "i" } }
  //   : {};
  Applications.find({problemId: problemId})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving applications.",
      });
    });
};

exports.findByUserName = (req, res) => {
  const userName = req.query.userName;
  Applications.find({ userName: userName })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving applications.",
      });
    });
};

// Find a single application with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Applications.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found Application with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Application with id=" + id });
    });
};

// Update an Application by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  Applications.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Application with id=${id}. Maybe Application was not found!`,
        });
      } else res.send({ message: "Application was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Application with id=" + id,
      });
    });
};

// Delete a Application with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Applications.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Application with id=${id}. Maybe Application was not found!`,
        });
      } else {
        res.send({
          message: "Application was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Application with id=" + id,
      });
    });
};

// Delete all Applications from the database.
exports.deleteAll = (req, res) => {
  Applications.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Applications were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Applications.",
      });
    });
};
