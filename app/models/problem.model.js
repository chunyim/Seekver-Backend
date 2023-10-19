module.exports = (mongoose) => {
  var schema = mongoose.Schema({
    seekerName: String,
    title: String,
    description: String,
    category: String,
    date: Date,
    rewards: String,
  });

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Problems = mongoose.model("problems", schema);
  return Problems;
};
