if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to murmuringrivers.";
  };

  Template.hello.events({
    'click input': function () {
      var consonants = 'bcdfghjklmnpqrstvwxyz',
          vowels = 'aeiou',
          rand = function(limit) {
              return Math.floor(Math.random()*limit);
          },
          i, word='', length = parseInt(7,10),
          consonants = consonants.split(''),
          vowels = vowels.split('');
      for (i=0;i<length/2;i++) {
          var randConsonant = consonants[rand(consonants.length)],
              randVowel = vowels[rand(vowels.length)];
          word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
          word += i*2<length-1 ? randVowel : '';
      }
      var pin = Router.current().data().pin;
      Meteor.call('pushFirebase',pin, word);
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    'pushFirebase': function(pin, string){
      fb = new Firebase(url+pin);
      fb.push({name: string});
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