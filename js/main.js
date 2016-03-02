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
    // window.alert(buildURL(currentSub,currentRange));
    //data structure of json object:
      //returns listing of first 26 or so posts
      //listing.data.children contains array of all posts (each is an object)
      //listing.data.children[n].data is object of all post information

    var posts = listing.data.children; //array of all posts

    $.each(posts, function(index,post) {
      if (!post.data.domain.search("streamable")) {
        console.log(post.data.title);

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

        //break once the counter variable reaches 5


  });
};



});
