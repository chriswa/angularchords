app.controller('prefsController', function($scope, Music, Model) {

  var prefValueDisplayNames = {
    undefined: '',
    0: "\u2665",
    1: "+",
    10: "-"
  }

  $scope.getPrefsCellContent = function (chord, noteIndex) {
    var transposedChordShortName = Music.noteNames[noteIndex] + chord.shortNames[0];
    var pref = Model.chordPrefs[ transposedChordShortName ];
    return prefValueDisplayNames[pref];
  };

  $scope.getPrefsCellClass = function (chord, noteIndex) {
    var transposedChordShortName = Music.noteNames[noteIndex] + chord.shortNames[0];
    return '';
  };

  $scope.cyclePrefsCell = function (chord, noteIndex) {
    var transposedChordShortName = Music.noteNames[noteIndex] + chord.shortNames[0];
    var oldRule = Model.chordPrefs[ transposedChordShortName ];

    var nextRule = {
      undefined: 0,
      0: 1,
      1: 10,
      10: undefined
    };
    var newRule = nextRule[oldRule];

    if (newRule !== undefined) {
      Model.chordPrefs[ transposedChordShortName ] = newRule;
    }
    else {
      delete(Model.chordPrefs[ transposedChordShortName ]);
    }
  };

  $scope.load = function(profile) {
    Model.selectedProfile = profile;
    Model.chordPrefs = profile.chordPrefs;
  };

  $scope.save = function() {
    Model.saveProfiles();
  };

  $scope.create = function() {
    var newTitle = prompt("New Profile Name");
    if (newTitle) {
      Model.selectedProfile = {
        title: newTitle,
        chordPrefs: { C: 0, D: 0, E: 0, F: 1, G: 0, A: 0, Dm: 1, Em: 0, Fm: 1, Am: 0, 'D7': 0, 'E7': 0, 'A7': 0, 'B7': 10 } // default chordPrefs!
      }
      Model.saveProfiles();
    }
  };

});
