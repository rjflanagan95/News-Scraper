function displayResults(articles) {
  $("#articles").empty();

  articles.forEach(function(article) {
    var headline = $("<h2>");
    headline.text(article.headline);
    headline.addClass("card-title");

    var link = $("<a>").attr("href", article.link);
    link.append(headline);

    var author = $("<h5>");
    if (article.author) {
      author.text(article.author);
    }
    var description = $("<p>");
    description.text(article.description);
    description.addClass("card-text");

    // var articleImg = $("<img>");
    // articleImg.attr("src", article.imageURL);
    // articleImg.attr("style", "width:165px;height:110px");

    var cardContents = $("<div>").append(
      link,
      author,
      description
      // articleImg
    );

    cardContents.addClass("card-body");

    var newArticle = $("<div>");
    newArticle.append(cardContents);
    newArticle.addClass("card");

    $("#articles").append(newArticle);
    $("#articles").append("<br>");
  });
}

$.getJSON("/articles", function(data) {
  displayResults(data);
});