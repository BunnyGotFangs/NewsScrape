// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

// Require our Models
var db = require("./models");

var PORT = 3000;

//Initialize Express
var app = express();

// Initiate body-parser for the app
app.use(bodyParser.urlencoded({ extended: true }));

// Express-Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Make public a static dir
app.use(express.static("public"));

// if else statement to use localhost if not being hoseted on Herko
//  Seemed helpful for development without having to switch code repeatedly
// credit to davesrose for the if/else setup
if(process.env.NODE_ENV == "production"){


  mongoose.connect("mongodb://localhost/mongoHeadlines");
}
else{
  mongoose.connect("mongodb://localhost/newsScrape");
}


// Import Routes/Controller

app.get("/scrape", function(req, res) {
  // Make a request call to grab the HTML body from the site of your choice
  request("https://people.com/tag/news/", function(req, response) {

    var $ = cheerio.load(response.data);

    // Look for the specified clas
    $("div headline").each(function(i, element) {
      
      var result = {};
      
      // grab the link
      result.link = $(this)
      .children()
      .attr("href");
      // Grabbing the title requires going for the child of the child with class .category
      result.title = $(this)
      .children(".category")
      .text();

      //Use the Articles Model to add each new article
      db.Article.create(result)
        .then(function(dbArticle) {
      //Add the new Article to the DB.  This will give it a unique ID.  Using array would have only given the array the ID, not the entry
      console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

//Route to get all of the scraped articles
app.get("/articles", function (req, res) {
  db.articles.find({})
  .then(function(dbarticles) {
    res.json(dbarticles);
  })
  .catch(function(err) {
    res.json(err);

  });
});

// Get the articles by article ID and populate with the comments
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db
  db.articles.findOne({ _id: req.params.id })
  .populate("comments")
  .then(function(dbarticles) {
    res.json(dbarticles);
    })
    .catch(function(err) {
    res.json(err);
  });
});

app.post("/articles/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  db.comments.create(req.body)
    .then(function(dbcomments) {
  // And save the comment to the db
  return db.articles.findOneAndUpdate({ _id: req.params.id }, { comments: dbcomments._id }, { new: true });
})
.then(function(dbarticles) {
    // Log any errors
    res.json(dbarticles);
    })
    .catch(function(err) {
    // Otherwise
    res.json(err);
    });
});

// Launch App
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
