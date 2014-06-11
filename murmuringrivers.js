if (Meteor.isClient) {
  var tweetCount =0,
  tweetsData,
  tweet;

  Template.search.rendered = function(){
    var pin = Router.current().data().pin;
    Session.set('pin', pin);
    $(document).on('click', '#validate', function() {
      Meteor.call('pushFirebase', Session.get('pin'), tweet);
      Meteor.call('addTweet');
    });
    $(document).on('click', '#delete', function() {
      Meteor.call('addTweet');
    });
  }

Template.search.events({
    'click #newTweet': function () {
      if($('#hashtag').val()!==''){
        if(tweetCount==0 || Session.get("hashtag")!==$('#hashtag').val()){
          Session.set("hashtag", $('#hashtag').val());
          $('.form').after('<p class="loading">Wait before loading</p>');
          $('.tweetContainer').remove();
          Meteor.call('getTweet', Session.get("hashtag"), function(error, data){
            if(error)
              console.log(error);
          else{
              tweetsData=data;
          }
          $('.loading').remove();
          $('.form').after('<section class="tweetContainer"></section>');
          Meteor.call('addTweet');
          });
        }
      }
    },
    'keypress #hashtag': function(evt){
      if (evt.keyCode === 13) {
        if($('#hashtag').val()!==''){
          if(tweetCount==0 || Session.get("hashtag")!==$('#hashtag').val()){
            Session.set("hashtag", $('#hashtag').val());
            $('.form').after('<p class="loading">Wait before loading</p>');
            $('.tweetContainer').remove();
            Meteor.call('getTweet', Session.get("hashtag"), function(error, data){
              if(error)
                console.log(error);
            else{
                tweetsData=data;
            }
            $('.loading').remove();
            $('.form').after('<section class="tweetContainer"></section>');
            Meteor.call('addTweet');
            });
          }
        }
      }
    },
});
Template.hello.events({
  'click #checkPin': function(){
    var pin = $('#pin').val();
    if(pin.length==4){
      Router.go('search', {pin: pin});
    }
  }
});


  Meteor.methods({
    'addTweet': function(){
    tweet={
        username: tweetsData.statuses[tweetCount].user.name,
        profile_picture: tweetsData.statuses[tweetCount].user.profile_image_url,
        text: tweetsData.statuses[tweetCount].text,
        date: tweetsData.statuses[tweetCount].created_at
    };
    $('.tweet').remove();
    $('.tweetContainer').append('<div class="tweet"><img src="'+tweet.profile_picture+'"><strong>'+tweet.username+'</strong><p class="text">'+tweet.text+'</p><p class="date">'+tweet.date+'</p><div class="btn-holder"><button id="validate">Validate</button><button id="delete">Delete</button><div class="clearfix"></div></div></div>');
    tweetCount++;
    if(tweetCount==98){
        Meteor.call('getTweet', Session.get("hashtag"), function(error, data){
            if(error)
                console.log(error);
            else{
                tweetCount=1;
                tweetsData=data;
            }
        });
    }
  }
});
}
if (Meteor.isServer) {
  Future = Npm.require('fibers/future');
  Meteor.methods({
    'pushFirebase': function(pin, object){
      fb = new Firebase(url+pin);
      fb.push({tweet: object});
    },
    'getTweet': function(hashtag){
        var fut = new Future();
        if(hashtag.charAt(0)!=="#"){
          hashtag = "#"+hashtag;
      }
      T.get('search/tweets', { q: hashtag, count: 100, result_type: "recent"}, function(err, data, response) {
          fut.return(data);
      });
      return fut.wait();
    }
  });
}

Router.configure({
  layoutTemplate: 'layout',
});
Router.map(function() {
  this.route('search', {
    path: '/:pin',
    data: function(){
       return {pin : this.params.pin};
    }
  });
  this.route('hello', {
    path: '/',
  });
});