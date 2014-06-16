if (Meteor.isClient) {
  var tweetCount =0,
  tweetAdded = 0,
  tweetsData,
  tweet;

  Template.layout.title = function(){
    var title = Session.get('hashtag');
    if(title!=="Try me like one of this french girls")
      title = "#"+title;
    return title;
  }
  Template.search.pin = function(){
    return Router.current().data().pin;
  }
  Template.search.rendered = function(){
    $('endForm').remove();
    var pin = Session.get('pin');

    $(document).on('click', '#validate', function() {
      tweetAdded++;
      Meteor.call('checkFirebase', pin, function(error, data){
        if(!data){
          $('.tweetContainer').remove();         
          Router.go('hello');
        }
        else{
          TweenMax.to($('.tweetContainer'), 0.2, {top: "-400px"});
          $('main').append('<p class="loadPhrase">#'+Session.get('hashtag')+' is coming</p>');
          Meteor.call('pushFirebase', Session.get('pin'), tweet, function(error){
            if(error)
              console.log(error);
          });
          setTimeout(function(){
            $('.tweetContainer').remove();
          }, 200);
          setTimeout(function(){
            Meteor.call('addTweet', function(){
              $('.loadPhrase').remove();
            });
          }, 300);
          if(tweetAdded=5){
            setTimeout(function(){
              $('main').append('<section class="endForm"><p>Sign up for more</p></section>');
            }, 500);
          }
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
          TweenMax.to($('.tweetContainer'), 0.2, {opacity: 0});
          $('main').append('<p class="loadPhrase">#'+Session.get('hashtag')+' is coming</p>');
          setTimeout(function(){
            $('.tweetContainer').remove();
          }, 200);
          setTimeout(function(){
            Meteor.call('addTweet', function(){
              $('.loadPhrase').remove();
            });
          }, 300);
          if(tweetCount==5){
            setTimeout(function(){
              $('main').append('<section class="endForm"><p>Sign up for more</p></section>');
            }, 500);
          }
        }
      });
    });
    $(document).on('click', '.befHeaderText', function(){
      if($('header').css("left")!="-250px")
        TweenMax.to($('header'), 0.5, {left: "-250px"});
      else
        TweenMax.to($('header'), 0.5, {left: 0});
    });
    $(document).on('touchmove', '.befHeaderText', function(){
      if($('header').css("left")!="-250px")
        TweenMax.to($('header'), 0.5, {left: "-250px"});
      else
        TweenMax.to($('header'), 0.5, {left: 0});
    });
    $(document).on('touchstart', '.befHeaderText', function(){
      if($('header').css("left")!="-250px")
        TweenMax.to($('header'), 0.5, {left: "-250px"});
      else
        TweenMax.to($('header'), 0.5, {left: 0});
    });
    $(document).on('click', '#newHeaderTweet', function(){
      TweenMax.to($('header'), 0.5, {left: 0});
      if($('#hashtagHeader').val()!=='' && tweetCount<5){
        if(tweetCount==0 || Session.get("hashtag")!==$('#hashtagHeader').val()){
          document.getElementById('hashtagHeader').placeholder=$('#hashtagHeader').val();
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
          Meteor.call('addTweet');
          $('#hashtagHeader').val("");
          });
        }
      }
    });
  }
  Template.hello.rendered = function(){
    delete Session.keys['pin'];
    Session.set('hashtag', "Try me like one of this french girls");
    $('.loader').remove();
    $('.tweetContainer').remove();
    $('endForm').remove();
  }

Template.search.events({
    'click #newTweet': function () {
      if($('#hashtag').val()!==''){
        if(tweetCount==0 || Session.get("hashtag")!==$('#hashtag').val()){
          Session.set("hashtag", $('#hashtag').val());
          document.getElementById('hashtagHeader').placeholder=$('#hashtag').val();
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
          document.getElementById('hashtagHeader').placeholder=$('#hashtag').val();
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
          $('.loader').remove();
          $('#checkPin').after('<p id="state">Votre pin est invalide</p>');
        }
      });
    } else {
      
      $('#state').remove();
      $('.loader').remove();
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
    $('main').append('<div class="tweetContainer"><div class="tweet"><div class="circular"><img src="'+tweet.profile_picture+'"></div><strong>'+tweet.username+'</strong><p class="text">'+tweet.text+'</p><p class="date">'+tweet.date+'</p></div><div class="btn-holder"><div class="btn" id="validate"><div class="sprite befAdd"></div><span>Add</span></div><div class="btn" id="delete"><div class="sprite befDel"></div><span>Delete</span></div></div></div>');
          TweenMax.to($('.tweet'), 0.01, {left: "400px", opacity: 1});
          TweenMax.to($('.btn-holder'), 0.01, {left: "400px", opacity: 1});
          TweenMax.to($('.tweet'), 0.4, {left: 0});
          TweenMax.to($('.btn-holder'), 0.4, {left: 0});
    tweetCount++;
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
      T.get('search/tweets', { q: hashtag, count: 50, result_type: "recent"}, function(err, data, response) {
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