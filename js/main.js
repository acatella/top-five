//Custom JS for Reddit Top 5 Web App

$(document).ready(function() {

//When a subreddit is chosen, populate video files w/ top 5 gifs on
//for chosen date range

//TODO: what to do if gif or poster aren't valid links anymore?
//TODO: incorporate gifs from other sources other than streamable

//TODO: optimize for mobile
  //TODO: open tab comments in new tab
  //TODO: have comment mask always showing when screen is small
  //TODO: add a button for comments
  //TODO: clicking anywhere in frame plays/pauses video

//Controls subreddit and range selector dropdowns
var currentSub = "soccer";
var currentRange = "today";
$("[aria-labelledby='subreddit-dropdown'] a").on('click', function(e) {
  var clicked = $(e.target);
  currentSub = clicked.attr('id');
  $('#subreddit-dropdown').html(currentSub+"  <span class='caret dark-grey'></span>");
  gifGen();
});

$("[aria-labelledby='date-dropdown'] a").on('click', function(e) {
  var clicked = $(e.target);
  currentRange = clicked.attr('data-value');
  $('#date-dropdown').html(clicked.attr('id') +"  <span class='caret dark-grey'></span>");
  gifGen();
});

//Updates hero video when a thumb is clicked
$('#video-thumbs').on('click', function(e) {
  var $clicked = $(e.target);

  //prevents error when white space between gifs is clicked, ensures gif is correct
  if ($clicked.hasClass('thumb')) {
    return false;
  } else if ($clicked.hasClass('comment-link')) {
    var gifNumber = $clicked.attr('data-value');
    var $clickedGif = $('#video-thumbs').find('#'+ gifNumber);
  } else if ($clicked.hasClass('flex-item')) {
    var $clickedGif = $clicked.parent().parent().find('.gif');
  } else {var $clickedGif = $clicked.parent().find('.gif');}
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

//prevents going to comments from loading from thumbs on mobile
$('.comment-link').on('tap',function(e) {
  $(e.target).preventDefault();
});

//plays video when mask is clicked
$('#hero-container').on('click', function(e) {
  var $heroGif = $('#hero-container').find('.gif');
  
  if ( $heroGif.get(0).paused) {
    $heroGif.get(0).play();
  }

  else {
    $heroGif.get(0).pause();
  }

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
        var $commentsURL = 'https://www.reddit.com/r/' + currentSub + '/comments/' + $postID;
        var $linkEl = $('<a>').attr({
          'href': $commentsURL,
          'target': '_blank',
          'class': 'comment-link',
          'data-value': 'gif' + counter
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
