# News-Scraper

This app scrapes articles from the New York Times Politics section, stores them in a MongoDB collection and displays them on the page. New articles can be scraped by clicking the Scrape button, or the entire collection can be wiped out by clicking the Clear button.

## How to Use
This app is deployed at https://blooming-spire-68198.heroku.com, or can be run locally. To run locally, download the directory and run `npm install` from the root. In separate command line windows, run `mongod` and `mongo` and keep these open in the background. Run `npm start` or `node server` from the root of the directory and open http://localhost:3000 in your preferred browser.