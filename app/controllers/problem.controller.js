const db = require("../models");
const Problems = db.problems;

// Create and Save a new Problem
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Problem
  const problem = new Problems({
    seekerName: req.body.seekerName,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    date: req.body.date,
    rewards: req.body.rewards,
  });

  // Save Problem in the database
  Problems.create(problem)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the problem.",
      });
    });
};

// Retrieve all Problems from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  Problems.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving problems.",
      });
    });
};

exports.findBySeekerName = (req, res) => {
  const seekerName = req.query.seekerName;
  // var condition = seekerName
  //   ? { seekerName: { $regex: new RegExp(seekerName), $options: "i" } }
  //   : {};
  Problems.find({ seekerName: seekerName })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving problems.",
      });
    });
};

// Find a single Problem with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Problems.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Problem with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Problem with id=" + id });
    });
};

// Update a Problem by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  Problems.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Problem with id=${id}. Maybe Problem was not found!`,
        });
      } else res.send({ message: "Problem was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Problem with id=" + id,
      });
    });
};

// Delete a Problem with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Problems.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Problem with id=${id}. Maybe Problem was not found!`,
        });
      } else {
        res.send({
          message: "Problem was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Problem with id=" + id,
      });
    });
};

// Delete all Problems from the database.
exports.deleteAll = (req, res) => {
  Problems.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Problems were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all problems.",
      });
    });
};
