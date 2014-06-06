if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to murmuringrivers.";
  };

  Template.hello.events({
    'click input': function () {
      Meteor.call('pushFirebase', 'D-D-D-DROP THE BASE !');
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    'pushFirebase': function(string){
      fb.push({name: string});
    }
  });
}
Router.map(function() {
  this.route('hello', {path: '/'});
});