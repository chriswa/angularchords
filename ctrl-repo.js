app.controller('repoController', function($scope, Music, Model) {

  $scope.save = function() {
    // remove old file with this same filename?
    Model.files = _.without(Model.files, _.findWhere(Model.files, { title: $scope.filename }));
    // add file
    var newFile = {
      title:   $scope.filename,
      content: Model.content,
    };
    Model.files.push(newFile);
    Model.saveFiles();
  };

  $scope.load = function(file) {
    $scope.filename = file.title;
    Model.content   = file.content;
  };

  $scope.delete = function() {
    if (confirm()) {
      var file = _.findWhere(Model.files, { title: $scope.filename });
      Model.files = _.without(Model.files, file);
      Model.saveFiles();
      $scope.load({}); // blank out current filename and content
    }
  };

});

/*
app.controller('repoController', function($scope, Music, Model) {

  $scope.files = [];
  try {
    $scope.files = JSON.parse(window.localStorage.getItem('angularchords.files'));
  } catch(err) {}

  $scope.save = function() {
    // remove old file with this same filename?
    $scope.files = _.without($scope.files, _.findWhere($scope.files, { title: $scope.filename }));
    // add file
    var newFile = {
      title:   $scope.filename,
      content: Model.content,
    };
    $scope.files.push(newFile);
    window.localStorage.setItem('angularchords.files', JSON.stringify($scope.files));
  };

  $scope.load = function(file) {
    $scope.filename = file.title;
    Model.content   = file.content;
  };

  $scope.delete = function() {
    if (confirm()) {
      var file = _.findWhere($scope.files, { title: $scope.filename });
      $scope.files = _.without($scope.files, file);
      window.localStorage.setItem('angularchords.files', JSON.stringify($scope.files));
      $scope.load({}); // blank out current filename and content
    }
  };

});
*/
