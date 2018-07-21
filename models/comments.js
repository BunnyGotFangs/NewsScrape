// Dependency - Require Mongoose to create the schema for the articles
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Body of the comment
  body: {
    type: String
  }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var comments = mongoose.model("comments", commentSchema);

// Export the Note model
module.exports = comments;