var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Article.find({}).then(function(dbArticles) {
      res.render("index", {
        articles: dbArticles
      });
    })
    .catch(function(err) {
        res.json(err);
    });
  });

  // Load word page and pass in a word by id
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ id: req.params.id }).then(function(dbArticle) {
      res.render("article", {
        article: dbArticle
      });
    })
    .catch(function(err) {
        res.json(err);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
