if (Meteor.isClient) {
  var tweetCount =0,
      tweetsData,
      tweet;

  Template.hello.rendered = function(){
    var pin = Router.current().data().pin;
    Session.set('pin', pin);
  }

  Template.hello.events({
    'click #newTweet': function () {
      if(tweetCount==0 || Session.get("hashtag")!==$('#hashtag').val()){
        Session.set("hashtag", $('#hashtag').val());
        Meteor.call('getTweet', Session.get("hashtag"), function(error, data){
          if(error)
            console.log(error);
          else{
            tweetsData=data;
            tweet={
              username: tweetsData.statuses[tweetCount].user.name,
              profile_picture: tweetsData.statuses[tweetCount].user.profile_image_url,
              text: tweetsData.statuses[tweetCount].text,
              date: tweetsData.statuses[tweetCount].created_at
            };
            $('.tweet').remove();
            $('.tweetContainer').append('<div class="tweet"><img src="'+tweet.profile_picture+'"><strong>'+tweet.username+'</strong><p class="text">'+tweet.text+'</p><p class="date">'+tweet.date+'</p><div class="btn-holder"><button id="ok">Validate</button><button id="not">Delete</button><div class="clearfix"></div></div></div>');
            tweetCount++;
          }
        });
      }
    }, 
    'click #ok': function(){
      Meteor.call('pushFirebase', Session.get('pin'), tweet);
        tweet={
          username: tweetsData.statuses[tweetCount].user.name,
          profile_picture: tweetsData.statuses[tweetCount].user.profile_image_url,
          text: tweetsData.statuses[tweetCount].text,
          date: tweetsData.statuses[tweetCount].created_at
        };
        $('.tweet').remove();
        $('.tweetContainer').append('<div class="tweet"><img src="'+tweet.profile_picture+'"><p>'+tweet.username+'</p><p>'+tweet.text+'</p><p>'+tweet.date+'</p><button id="ok">Validate</button><button id="not">Delete</button></div>');
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
    }, 
    'click #not': function(){
        tweet={
          username: tweetsData.statuses[tweetCount].user.name,
          profile_picture: tweetsData.statuses[tweetCount].user.profile_image_url,
          text: tweetsData.statuses[tweetCount].text,
          date: tweetsData.statuses[tweetCount].created_at
        };
        $('.tweet').remove();
        $('.tweetContainer').append('<div class="tweet"><img src="'+tweet.profile_picture+'"><p>'+tweet.username+'</p><p>'+tweet.text+'</p><p>'+tweet.date+'</p><button id="ok">Validate</button><button id="not">Delete</button></div>');
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

Router.map(function() {
  this.route('hello', {
    path: '/:pin',
    data: function(){
     return {pin : this.params.pin};
    }
  });
});