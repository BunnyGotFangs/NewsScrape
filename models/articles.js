// Dependency - Require Mongoose to create the schema for the articles
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
// Article Title
  title: {
		type: String,
		required: true
	},
// Link to the Article
	link: {
		type: String,
		required: true
	},
// Comments on the Article
	comment: {
		type: Schema.Types.ObjectId,
		ref: "comments" // reference to comments.js
	}
});
// Artilces Model
var articles = mongoose.model("articles", articleSchema);
module.exports = articles;