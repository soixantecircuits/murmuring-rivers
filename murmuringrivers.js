if (Meteor.isClient) {
  var tweetCount =0,
  tweetsData,
  tweet;

  Template.search.pin = function(){
    return Router.current().data().pin;
  }
  Template.search.rendered = function(){
    var pin = Session.get('pin');
    $(document).on('click', '#validate', function() {
      Meteor.call('checkFirebase', pin, function(error, data){
        if(!data){
          $('.tweetContainer').remove();         
          Router.go('hello');
        }
        else{
          TweenMax.to($('.tweet'), 0.2, {top: "-400px"});
          TweenMax.to($('.btn-holder'), 0.2, {top: "-400px"});
          $('.tweetContainer').append('<p class="loadPhrase">Twitter is coming</p>');
          Meteor.call('pushFirebase', Session.get('pin'), tweet);
          setTimeout(function(){
            $('.tweet').remove();
            $('.btn-holder').remove();
          }, 200);
          setTimeout(function(){
            Meteor.call('addTweet', function(){
              $('.loadPhrase').remove();
            });
          }, 300);
        }
      });
    });
    $(document).on('click', '#delete', function() {
      Meteor.call('checkFirebase', pin, function(error, data){
        if(!data){
          $('.tweetContainer').remove();
          Router.go('hello');
        }
        else{
          TweenMax.to($('.tweet'), 0.2, {opacity:0});
          TweenMax.to($('.btn-holder'), 0.2, {opacity:0});
          setTimeout(function(){
            $('.tweet').remove();
            $('.btn-holder').remove();
          }, 200);
          setTimeout(function(){
            Meteor.call('addTweet', function(){
              $('.loadPhrase').remove();
            });
          }, 300);
          $('.tweetContainer').append('<p class="loadPhrase">Twitter is coming ...</p>');
        }
      });
    });
    $(document).on('click', '.befHeaderText', function(){
      TweenMax.to($('header'), 0.5, {left: "-250px"});
    });
    $(document).on('touchmove', '.befHeaderText', function(){
      TweenMax.to($('header'), 0.5, {left: "-250px"});
    });
    $(document).on('touchstart', '.befHeaderText', function(){
      TweenMax.to($('header'), 0.5, {left: "-250px", delay: 0.5});
    });
    $(document).on('click', '#newHeaderTweet', function(){
      TweenMax.to($('header'), 0.5, {left: 0});
      if($('#hashtagHeader').val()!==''){
        if(tweetCount==0 || Session.get("hashtag")!==$('#hashtagHeader').val()){
          Session.set("hashtag", $('#hashtagHeader').val());
          TweenMax.to($('.form'), 0.15, {scale: 0, transformOrigin: "center"});
          TweenMax.to($('.form'), 0.01, {scale: 1, transformOrigin: "center", display: "none", delay: 0.15});
          TweenMax.to($('.header-input'), 0.2, {right: '-250px'});
          $('.form').after('<div class="loader"></div>');
          $('.tweetContainer').remove();
          Meteor.call('getTweet', Session.get("hashtag"), function(error, data){
            if(error)
              console.log(error);
            else{
              tweetsData=data;
          }
          $('.loader').remove();
          $('.form').after('<section class="tweetContainer"></section>');
          Meteor.call('addTweet');
          $('#hashtagHeader').val("");
          });
        }
      }
    });
  }


Template.search.events({
    'click #newTweet': function () {
      if($('#hashtag').val()!==''){
        if(tweetCount==0 || Session.get("hashtag")!==$('#hashtag').val()){
          Session.set("hashtag", $('#hashtag').val());
          TweenMax.to($('.form'), 0.15, {scale: 0, transformOrigin: "center"});
          TweenMax.to($('.form'), 0.01, {scale: 1, transformOrigin: "center", display: "none", delay: 0.15});
          TweenMax.to($('.header-input'), 0.2, {right: '-250px'});
          $('.form').after('<div class="loader"></div>');
          $('.tweetContainer').remove();
          Meteor.call('getTweet', Session.get("hashtag"), function(error, data){
            if(error)
              console.log(error);
            else{
              tweetsData=data;
          }
          $('.loader').remove();
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
          TweenMax.to($('.form'), 0.15, {scale: 0, transformOrigin: "center"});
          TweenMax.to($('.form'), 0.01, {scale: 1, transformOrigin: "center", display: "none", delay: 0.15});
          TweenMax.to($('.header-input'), 0.2, {right: '-250px'});
          $('.form').after('<div class="loader"></div>');
          $('.tweetContainer').remove();
          Meteor.call('getTweet', Session.get("hashtag"), function(error, data){
            if(error)
              console.log(error);
            else{
              tweetsData=data;
          }
          $('.loader').remove();
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
      $('#pin').css({border: '1px solid #292a30'});
      $('#state').remove();
      $('#checkPin').after('<div class="loader"></div>');
      Meteor.call('checkFirebase', pin, function(error, data){
        if(data){
          Meteor.call('activeFirebase', pin);
          Router.go('search', {pin: pin});
        }
        else {
          
          $('#state').remove();
          $('#checkPin').after('<p id="state">Your pin is invalid</p>');
        }
      });
    } else {
      
      $('#state').remove();
      $('#checkPin').after('<p id="state">Your pin is invalid</p>');
    }
  },
  'keypress #pin': function(evt){
    if (evt.keyCode === 13) {
    var pin = $('#pin').val();
    if(pin.length==4){
      $('#pin').css({border: '1px solid #292a30'});
      $('#state').remove();
      $('#checkPin').after('<div class="loader"></div>');
      Meteor.call('checkFirebase', pin, function(error, data){
        if(data){
          Meteor.call('activeFirebase', pin);
          Router.go('search', {pin: pin});
        }
        else {
          
          $('#state').remove();
          $('#checkPin').after('<p id="state">Votre pin est invalide</p>');
        }
      });
    } else {
      
      $('#state').remove();
      $('#checkPin').after('<p id="state">Votre pin est invalide</p>');
    }
    }
  },
});


  Meteor.methods({
    'addTweet': function(){
    tweet={
        username: tweetsData.statuses[tweetCount].user.name,
        profile_picture: tweetsData.statuses[tweetCount].user.profile_image_url,
        text: tweetsData.statuses[tweetCount].text,
        date: tweetsData.statuses[tweetCount].created_at
    };
    $('.tweetContainer').append('<div class="tweet"><div class="circular"><img src="'+tweet.profile_picture+'"></div><strong>'+tweet.username+'</strong><p class="text">'+tweet.text+'</p><p class="date">'+tweet.date+'</p></div><div class="btn-holder"><div class="btn" id="validate"><div class="sprite befAdd"></div><span>Add</span></div><div class="btn" id="delete"><div class="sprite befDel"></div><span>Delete</span></div></div>');
          TweenMax.to($('.tweet'), 0.01, {left: "400px", opacity: 1});
          TweenMax.to($('.btn-holder'), 0.01, {left: "400px", opacity: 1});
          TweenMax.to($('.tweet'), 0.4, {left: 0});
          TweenMax.to($('.btn-holder'), 0.4, {left: 0});
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
    },
    'checkFirebase': function(pin){
      var fut = new Future();
      fb = new Firebase(url+pin);
      fb.child('pin').on('value', function(snapshot) {
        if(snapshot.val()!=pin){
          fut.return(false);
        } else 
          fut.return(true);
      });
      return fut.wait();
    },
    'activeFirebase': function(pin){
      fb = new Firebase(url+pin);
      fb.child('active').set(true);
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
    },
    onBeforeAction: function() {
      var pin = Router.current().data().pin;
      Session.set('pin', pin);
      Meteor.call('checkFirebase', pin, function(error, data){
        if(!data)
          Router.go('hello');
      });
    },
  });
  this.route('hello', {
    path: '/',
  });
});