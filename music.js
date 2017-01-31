app.factory('Music', function() {

  var Music = {};

  Music.notes = _.map('C,C#,D,D#,E,F,F#,G,G#,A,A#,B'.split(/,/), function(name, note) { return { note: note, name: name }; }); // { note: 0, name: 'C' }...
  
  function _buildInstrument(title, noteNameString) {
    var noteNamesToNotes = _.object('C,C#,D,D#,E,F,F#,G,G#,A,A#,B'.split(/,/), _.range(12));
    var notes = _.map(noteNameString.split(/,/), function(noteName) { return noteNamesToNotes[noteName]; });
    return {
      title: title,
      notes: notes
    };
  }
  Music.instruments = [
    _buildInstrument('Guitar', 'E,A,D,G,B,E'),
    _buildInstrument('Ukulele', 'G,C,E,A'),
    //{ title: 'Guitar',  notes: [4, 9, 2, 7, 11, 4] },
    //{ title: 'Ukulele', notes: [7, 0, 4, 9] },
  ];

  function _buildChord(title, shortNames, relativeNotesString, namesString) {
    var relativeNotes = relativeNotesString.split(/,/);
    var names         = namesString.split(/,/);
    if (relativeNotes.length !== names.length) { console.error('_buildChord error!'); }
    var chordNotes    = _.map(_.zip(relativeNotes, names), function(el) {
      return {
        relativeNote: parseInt(el[0], 10),
        name:         el[1]
      };
    });
    return {
      title:      title,
      notes:      chordNotes,
      shortNames: shortNames
    };
  }
  Music.chords = [
    _buildChord('Maj', ['', 'M', '/'], '0,4,7',    'R,3,5'),
    _buildChord('Min', ['m'],          '0,3,7',    'R,3,5'),
    _buildChord('7th', ['7'],          '0,4,7,10', 'R,3,5,7'),
    _buildChord('m6',  ['m6'],         '0,3,7,9',  'R,3,5,6'),

    //_buildChord('Sus', [''], '0,5,7',    'R,3,5'),
  ];

  Music.shortChordNameLookup = {};
  _.each(Music.chords, function(chord) {
    _.each(chord.shortNames, function(shortName) {
      Music.shortChordNameLookup[shortName] = chord;
    });
  });

  Music.noteNames = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B'.split(/,/);
  Music.noteNamesToNotes = _.object(Music.noteNames, _.range(12));

  Music.getNote = function(whiteKey, flatOrSharp) {
    var note = Music.noteNamesToNotes[whiteKey];
    if (flatOrSharp === '#') { note += 1; }
    if (flatOrSharp === 'b') { note -= 1; }
    return Music.mod12(note);
  };

  Music.mod12 = function(n) { return(((n % 12) + 12) % 12); };

  var chordRegex = new RegExp('\\b' + '([A-G])([#b]?)((?:m6|m|7|6|[/]([A-G])([#b]?))?)', 'g');

  // returns 0-1, 0 means definitely no chords, 1 means definitely chords, 0.5 means probable chords
  Music.doLineAnalysis = function(line) {
    var lineWithoutChords = line.replace(chordRegex, '');
    if (lineWithoutChords.length === line.length) {
      return 0; // there are no chords
    }
    //lineWithoutChords = lineWithoutChords.replace(/\[[\w\s]+\]/, ''); // e.g. [VERSE 2] - (E  C#m  G#  A)
    if (lineWithoutChords.match(/[A-Za-z]/)) {
      return 0.5; // there are chords and words
    }
    else {
      return 1; // there are only chords
    }
  };

  Music.chordReplace = function(targetString, callback) {
    return targetString.replace(chordRegex, function(_entireMatch, whiteKey, flatOrSharp, chordType, extraNoteWhiteKey, extraNoteFlatOrSharp) {
      if (chordType === undefined) { chordType = ''; }
      var note = Music.getNote(whiteKey, flatOrSharp);
      var extraNote = undefined;
      if (chordType.substr(0,1) === '/') {
        chordType = '/';
        extraNote = Music.getNote(extraNoteWhiteKey, extraNoteFlatOrSharp);
      }
      var chord = Music.shortChordNameLookup[chordType];
      return callback(note, chord, chordType, extraNote);
    });
  };

  Music.transposeChord = function(deltaSemitones, note, chordType, extraNote) {
    var transposedChordName = Music.noteNames[Music.mod12(note + deltaSemitones)] + chordType;
    if (extraNote !== undefined) {
      transposedChordName += Music.noteNames[Music.mod12(extraNote + deltaSemitones)];
    }
    return transposedChordName;
  };

  return Music;
});



