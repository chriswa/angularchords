app.controller('contentController', function($scope, Music, Model, fullscreen) {

  $scope.fullscreen = function() {
    fullscreen.start(Model.content);
  };

  // click on a chord in content to see it on fretboard
  $scope.contentClick = function($event) {
    var pos = getTextareaCursorPos($event.target);
    try {
      var word = Model.content.substr(0, pos).match(/\S*$/)[0] + Model.content.substr(pos).match(/^\S*/)[0];
      Music.chordReplace(word, function(note, chord, chordType, extraNote) {
        if (chord) {
          Model.selectedNote  = Music.notes[note];
          Model.selectedChord = chord;
        }
      });
    }
    catch (err) {}

  };

  var processChordsInContent = function(callback) {
    var lines = [];
    if (Model.content) {
      lines = Model.content.split(/\n/);
    }
    lines = _.map(lines, function(line) {
      var lineAnalysis = Music.doLineAnalysis(line);
      if (lineAnalysis > 0) { // aggressive!
        line = Music.chordReplace(line, callback);
      }
      return line;
    });
    return lines.join('\n');
  };

  $scope.transpose = function(deltaSemitones) {
    Model.content = processChordsInContent(function(note, chord, chordType, extraNote) {
      return Music.transposeChord(deltaSemitones, note, chordType, extraNote);
    });
  };

  $scope.smartTranspose = function(topScoreRosterIndex) {

    // get chord-scoring rules (lower is best, each unknown chord is scored at 999)
    var chordScoringRules = Model.chordPrefs;
    
    // find a list of all chords used in content
    var uniqueChords = {};
    processChordsInContent(function(note, chord, chordType, extraNote) {
      var hashKey = note + chordType + extraNote;
      uniqueChords[hashKey] = { note: note, chordType: chordType, extraNote: extraNote, scores: [] };
    });
    
    // try each of the 12 possibilities
    var deltaScores = [];
    _.each(_.range(12), function(deltaSemitonesCandidate) {

      // sum a score for each unique chord
      var scoreForThisCandidate = 0;
      _.each(uniqueChords, function(uniqueChord) {
        var transposedChordName = Music.transposeChord(deltaSemitonesCandidate, uniqueChord.note, uniqueChord.chordType, uniqueChord.extraNote);
        var transposedChordScore = chordScoringRules.hasOwnProperty(transposedChordName) ? chordScoringRules[transposedChordName] : 999;
        //console.log([transposedChordName, transposedChordScore]);
        scoreForThisCandidate += transposedChordScore;
      });
      //console.log("score = " + scoreForThisCandidate);
      deltaScores[deltaSemitonesCandidate] = { delta: deltaSemitonesCandidate, score: scoreForThisCandidate };
    });
    var selectedDelta = _.sortBy(deltaScores, function(el) { return el.score; })[topScoreRosterIndex].delta;
    $scope.transpose(selectedDelta);
  };

});
