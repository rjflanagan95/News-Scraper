// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'animals' (JSON) and creates a table body
function displayResults(articles) {
  // First, empty the table
  $("#articles").empty();

  // Then, for each entry of that json...
  articles.forEach(function(article) {
    // Append each of the animal's properties to the table
    var newArticle = $("<cardbody>").append(
      $("<h2>").text(article.headline),
      $("<h5>").text(article.author),
      $("<p>").text(article.description),
      // $("<td>").text(animal.weight),
      // $("<td>").text(animal.whatIWouldReallyCallIt)
    );

    $("#articles").append(newArticle);
  });
}

// // Bonus function to change "active" header
// function setActive(selector) {
//   // remove and apply 'active' class to distinguish which column we sorted by
//   $("th").removeClass("active");
//   $(selector).addClass("active");
// }

// 1: On Load
// ==========

// First thing: ask the back end for json with all animals
$.getJSON("/articles", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

// // 2: Button Interactions
// // ======================

// // When user clicks the weight sort button, display table sorted by weight
// $("#weight-sort").on("click", function() {
//   // Set new column as currently-sorted (active)
//   setActive("#animal-weight");

//   // Do an api call to the back end for json with all animals sorted by weight
//   $.getJSON("/weight", function(data) {
//     // Call our function to generate a table body
//     displayResults(data);
//   });
// });

// // When user clicks the name sort button, display the table sorted by name
// $("#name-sort").on("click", function() {
//   // Set new column as currently-sorted (active)
//   setActive("#animal-name");

//   // Do an api call to the back end for json with all animals sorted by name
//   $.getJSON("/name", function(data) {
//     // Call our function to generate a table body
//     displayResults(data);
//   });
// });



// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
