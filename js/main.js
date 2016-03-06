//Custom JS for Reddit Top 5 Web App

$(document).ready(function() {

//When a subreddit is chosen, populate video files w/ top 5 gifs on
//for chosen date range

//TODO: updated hero vid when thumb is clicked
//TODO: add hover effect that shows post title and number of upvotes
//TODO: limit poster size to thumbnail size
//TODO: what to do if gif or poster aren't valid links anymore?
//TODO: incorporate gifs from other sources
//TODO: add player controls

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
  currentRange = clicked.attr('data-value');
  $('#date-dropdown').html(clicked.attr('id') +"  <span class='caret'></span>");
  gifGen();
});

//Updates hero video when a thumb is clicked
$('.thumb').on('click', function(e) {
  var $clickedGif = $(e.target);
  var $heroCont = $('#hero-container');
  var $heroGif = $heroCont.find('.gif');
  $heroGif.addClass('thumb');
  $heroGif.removeAttr('controls');
  $heroGif.removeAttr('autoplya');
  $clickedGif.removeClass('thumb');
  $clickedGif.attr('controls','');  
  $clickedGif.parent().empty().append($heroGif);
  $heroCont.empty().append($clickedGif);

});

//function to build url
function buildURL(sub,range) {
  var url = "https://www.reddit.com/r/" + sub + "/top/.json?sort=top&t=" + range;
  return url
};

//function to return gifs
function gifGen() {
  $.getJSON(buildURL(currentSub,currentRange)).done(function(listing) {

    //testing line
    // console.log(buildURL(currentSub, currentRange));

    var posts = listing.data.children; //array of all posts
    var counter = 0; //counter variable
    var $heroDiv = $('#hero-container');

    $.each(posts, function(index,post) {
      if (!post.data.domain.search("streamable")) {
        counter++
        var postURL = post.data.url;
        var urlArray = postURL.split("/"); //break URL into array
        var uniqueID = urlArray[urlArray.length-1];

        var thumbSrc = "https://cdn.streamable.com/image/" + uniqueID + ".jpg";
        var gifSrc = "https://cdn.streamable.com/video/mp4/" + uniqueID + ".mp4";

        //testing line
        // console.log(gifSrc);

        var $gifEl = $('<video>');

        $gifEl.attr({
          'loop': '',
          'preload': 'none',
          // 'autoplay': '',
          'poster': thumbSrc,
          'id': 'gif' + counter,
          'class': 'gif',
        });


        var $srcEl = $('<source>').attr({
          'src': gifSrc,
          'type': 'video/mp4',
        });

        $gifEl.append($srcEl);

        if (counter == 1) {
          $gifEl.attr({
            'controls': '',
            'autoplay': ''
          });
          $heroDiv.empty();
          $heroDiv.append($gifEl);
        }

        else {
          var $gifDiv = $('#gifDiv' + counter);
          $gifDiv.empty().append($gifEl);
        }
      };
    });
  });
};



});
