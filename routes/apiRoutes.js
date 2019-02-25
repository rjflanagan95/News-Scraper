var db = require("../models")

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    app.get("/scrape", function(req, res) {
        axios.get("https://www.nytimes.com/section/politics").then(function(response) {
          var $ = cheerio.load(response.data);
      
          $(".css-1cp3ece").each(function(i, element) {
            // Save an empty result object
            let result = {};
      
            result.headline = $(element).find("h2").text();
            result.link = "https://nytimes.com/"+ $(element).find("a").attr("href");
            result.imageURL = $(element).find(".toneNews").attr("itemid");
            const descSplit = $(element).find("p").text().split("By ");
            result.description = descSplit[0];
            result.author = descSplit[1];
      
      
            // Create a new Article using the `result` object built from scraping
            // check if the word is already in the DB
            db.Article.findOne({ headline : result.headline }).then(function(dbArticle) {
              if (!dbArticle) {
                db.Article.create(result).then(function(dbArticle) {
                    res.redirect("/");
                }).catch(function(err) {
                  res.json(err);
                });
              } else {
                  res.redirect("/");
              }
            });
          });
        });
    });

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/clear", function(req, res) {
  db.Article.remove()
  .then(function(data) {
    res.redirect("/");
  })
  .catch(function(err) {
    res.json(err);
  });
});
}