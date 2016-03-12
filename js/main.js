//Custom JS for Reddit Top 5 Web App

$(document).ready(function() {

//When a subreddit is chosen, populate video files w/ top 5 gifs on
//for chosen date range

//TODO: what to do if gif or poster aren't valid links anymore?
//TODO: incorporate gifs from other sources other than streamable
//TODO: add link below hero video title that goes to comment section on reddit
  //Display 'Comments' when title is hovered
  //save post id as a variable
  //append that to end of string: 'https://www.reddit.com/r/soccer/comments/'
  //create an <a> $object w/ full url as href
  //empty the #hero-container #flex-container and append the $object
  //create and append an <h5> element with Comments
  //set <h5> elements opacity to none
  //when <a> is hovered, <h5> opacity to 1


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
$('#video-thumbs').on('click', function(e) {
  var $clicked = $(e.target);

  if ($clicked.hasClass('flex-item')) {
    var $clickedGif = $clicked.parent().parent().find('.gif');
  }

  else {var $clickedGif = $clicked.parent().find('.gif');}

  var $clickedMask = $clickedGif.parent().find('.mask');
  var $heroCont = $('#hero-container');
  var $heroGif = $heroCont.find('.gif');
  var $heroMask = $heroCont.find('.mask');
  $heroGif.addClass('thumb');
  $heroGif.removeAttr('controls');
  $heroGif.removeAttr('autoplay');
  $clickedGif.removeClass('thumb');
  $clickedGif.attr('controls','');
  $clickedGif.parent().empty().append([$heroGif,$heroMask]);
  $heroCont.empty().append([$clickedGif,$clickedMask]);
});

//function to build url
function buildURL(sub,range) {
  var url = "https://www.reddit.com/r/" + sub + "/top/.json?sort=top&t=" + range;
  return url
};

//function to return gifs
function gifGen() {
  $.getJSON(buildURL(currentSub,currentRange)).done(function(listing) {


    var posts = listing.data.children; //array of all posts
    var counter = 0; //counter variable
    var $heroDiv = $('#hero-container');
    var $videoThumbDiv = $('#video-thumbs');
    $heroDiv.empty();
    $videoThumbDiv.empty();

    $.each(posts, function(index,post) {

      if (!post.data.domain.search("streamable")) {
        counter++
        var postURL = post.data.url;
        var urlArray = postURL.split("/"); //break URL into array
        var uniqueID = urlArray[urlArray.length-1];

        //ensures uniqueID is only first 4 letters of streamable's identifier
        uniqueID = uniqueID.split("");
        uniqueID = uniqueID.slice(0,4);
        uniqueID = uniqueID.join("");

        var thumbSrc = "https://cdn.streamable.com/image/" + uniqueID + ".jpg";
        var gifSrc = "https://cdn.streamable.com/video/mp4/" + uniqueID + ".mp4";
        var gifTitle = post.data.title;

        //build mask element
        var $maskDiv = $('<div>').addClass('mask');
        var $titleDiv = $('<div>').addClass('flex-item title');
        $maskDiv.append($titleDiv);

        //build links to comments
        var $postID = post.data.id;
        var $commentsURL = 'https://www.reddit.com/r/soccer/comments/' + $postID;
        var $linkEl = $('<a>').attr({
          'href': $commentsURL,
          'class': 'comment-link'
        });
        var $noteEl = $('<p>').addClass('vis-toggle note');
        $noteEl.text('See Comments');
        $linkEl.text(gifTitle);
        $titleDiv.empty();
        $titleDiv.append($linkEl);
        $titleDiv.append($noteEl);

        //build gif element and source element
        var $gifEl = $('<video>');
        $gifEl.attr({
          'loop': '',
          'preload': 'none',
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
          $heroDiv.append($maskDiv);



        }

        // else {
        //   var $gifDiv = $('#gifDiv' + counter);
        //   $gifDiv.empty().append($gifEl);
        //   $gifDiv.append($maskDiv);
        // };

        else {
          var $thumbDiv = $('<div>').attr({
            'class': 'col-xs-6 col-sm-3 thumb',
            'id': 'gifDiv' + counter
          });
          $thumbDiv.append($gifEl);
          $thumbDiv.append($maskDiv);
          $videoThumbDiv.append($thumbDiv);
        }

        //adds clearfix div after 3rd video
        if (counter ==  3) {
          $videoThumbDiv.append($('<div>').addClass('clearfix visible-xs-block'));
        }

        if (counter == 5) {
          return false;
        }

      };
    });
  });
};



});
