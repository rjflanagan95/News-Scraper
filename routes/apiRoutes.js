var db = require("../models")

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    app.get("/scrape", function(req, res) {
        axios.get("https://www.nytimes.com/section/politics").then(function(response) {
          const $ = cheerio.load(response.data);

          const articleFindArray = []
          let articleArray = []
      
          $(".css-1cp3ece").each(function(i, element) {
            // Save an empty result object
            let result = {};
      
            result.headline = $(element).find("h2").text();
            result.link = "https://nytimes.com/"+ $(element).find("a").attr("href");
            // should try grabbing a different link, this photo is very degraded
            result.imageURL = $(element).find(".toneNews").attr("itemid");
            const descSplit = $(element).find("p").text().split("By ");
            result.description = descSplit[0];
            result.author = descSplit[1];

            // articleFindArray will be used to execute a series of findOne()
            articleFindArray.push(db.Article.findOne({ headline : result.headline }));
            // articleArray will hold the results from the scrape
            articleArray.push(result);
          });

          // check if any of the scraped articles already exist in the collection
          Promise.all(articleFindArray).then((articles) => {
            for (let i = 0; i < articles.length; i++) {
              // if the article existed, it will be returned as an object; if it didn't exist, it returns as null
              if (articles[i]) {
                // if it already existed, we want to filter it out of the results array so it doesn't get re-added
                articleArray[i] = null;
              }
            }

            // filtering the nullified results
            var filtered = articleArray.filter(function (el) {
              return el != null;
            });

            // insert any remaining entries and redirect (refresh) the page
            db.Article.insertMany(filtered)
            .then(function(dbArticles) {
              res.redirect("/");
            })
            .catch(function(err) {
              res.json(err);
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
  db.Article.deleteMany()
  .then(function(data) {
    res.redirect("/");
  })
  .catch(function(err) {
    res.json(err);
  });
});
}