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
  $.getJSON(buildURL(currentSub,currentRange)).done(function(listing) {
    console.log(buildURL(currentSub, currentRange));
    var posts = listing.data.children; //array of all posts
    var limit = 0; //counter variable
    $.each(posts, function(index,post) {
      if (!post.data.domain.search("streamable")) {
        limit++
        var postURL = post.data.url;
        var urlArray = postURL.split("/"); //break URL into array
        var uniqueID = urlArray[urlArray.length-1];

        var thumbSrc = "https://cdn.streamable.com/image/" + uniqueID + ".jpg";
        var gifSrc = "https://cdn.streamable.com/video/mp4/" + uniqueID + ".mp4";
        console.log(gifSrc);
        //TODO: everything is working but the objects i get from the fall are different than what i see in the json
      }
    });
    //if listing.data.children[n].data.domain is 'streamable'
      //+1 to counter variable
      //extract video ID from end of url - whatever comes after '.com/'
        //var uniqueID = post.data.url.split("/")[post.data.url.length-1]
      //build poster url 'https://cdn.streamable.com/image/' + uniqueID + '.jpg'
      //build video url 'https://cdn.streamable.com/mp4/' + uniqueID + '.mp4
      //build html tags
        //each new tag should have id of #gif[counter-variable]
        //if the counter is one, it's the hero video
          //empty #hero-container
          //append new htmls
        //else, append the html to #video-thumbs
        //build info to be displayed when hovered
          //use title and net score
          //if title is longer than x chars, shorten it

        //break once the counter variable reaches 5


  });
};



});
