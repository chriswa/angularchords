app.controller('fretsController', function($scope, Music, Model) {
  
  // view
  $scope.getFretOutput = function(fret, stringNote) {
    var fretNote = Music.mod12(fret + stringNote);
    var output = '';
    _.each(Model.selectedChord.notes, function(chordNote) {
      var absoluteNote = Music.mod12( Model.selectedNote.note + chordNote.relativeNote );
      if (fretNote === absoluteNote) { output = chordNote.name; }
    });
    return output;
  };
  $scope.getNoteOutput = function(fret, stringNote) {
    if ($scope.getFretOutput(fret, stringNote)) {
      return Music.noteNames[ Music.mod12(fret + stringNote) ];
    }
    return '';
  };

  // click to highlight frets
  $(document).on('click', 'td.fretCell', function() {
    $(this).toggleClass('fretCellHighlight');
  });

  // highlighted frets must disappear when the fretboard changes
  function resetFretCellHighlights() {
    $('td.fretCell').removeClass('fretCellHighlight');
  }
  $scope.$watch('selectedNote',       resetFretCellHighlights, true);
  $scope.$watch('selectedChord',      resetFretCellHighlights, true);
  $scope.$watch('selectedInstrument', resetFretCellHighlights, true);

});
