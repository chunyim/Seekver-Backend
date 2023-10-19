module.exports = (mongoose) => {
  var schema = mongoose.Schema({
    problemId: String,
    userName: String,
    firstName: String,
    lastName: String,
    applicationDate: Date,
    message: String,
    contactMethod: String,
    contact: String,
  });

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Applications = mongoose.model("application", schema);
  return Applications;
};
