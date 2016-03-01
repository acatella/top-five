//Custom JS for Reddit Top 5 Web App

$(document).ready(function() {

//When a subreddit is chosen, populate video files w/ top 5 gifs on
//for chosen date range

//Controls subreddit and range selector dropdowns
var currentSub = "soccer";
var currentRange = "today";
$("[aria-labelledby='subreddit-dropdown'] a").on('click', function(e) {
  var clicked = $(e.target);
  currentSub = clicked.attr('id');
  $('#subreddit-dropdown').html("r/"+currentSub+"  <span class='caret'></span>");
  gifGen();
});

$("[aria-labelledby='date-dropdown'] a").on('click', function(e) {
  var clicked = $(e.target);
  currentRange = clicked.attr('id');
  $('#date-dropdown').html(currentRange+"  <span class='caret'></span>");
  gifGen();
});

//function to build url
function buildURL(sub,range) {
  var url = "https://www.reddit.com/r/" + sub + "/top/.json?sort=top&t=" + range;
  return url
};

//function to return gifs
function gifGen() {
  
  $.getJSON(buildURL(currentSub,currentRange)).done(function() {
    window.alert("success");
  });
};

//does api call sort them by vote already?

});
