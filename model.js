app.factory('Model', function(Music) {

  window.Model = {};


  Model.selectedNote       = Music.notes[0];
  Model.selectedChord      = Music.chords[0];
  Model.selectedInstrument = Music.instruments[0];


  Model.profiles = JSON.parse(window.localStorage.getItem('angularchords.profiles7'));
  Model.selectedProfile = Model.profiles.list[ Model.profiles.selectedKey ];
  Model.chordPrefs = Model.selectedProfile.chordPrefs;

  Model.saveProfiles = function() {
    var title = Model.selectedProfile.title;
    Model.selectedProfile.chordPrefs = Model.chordPrefs;
    Model.profiles.selectedKey = title;
    Model.profiles.list[ title ] = Model.selectedProfile;
    window.localStorage.setItem('angularchords.profiles7', JSON.stringify(Model.profiles));
  };

  Model.content = '';

  Model.files = [];
  try {
    Model.files = JSON.parse(window.localStorage.getItem('angularchords.files'));
  } catch(err) {}

  Model.saveFiles = function() {
    window.localStorage.setItem('angularchords.files', JSON.stringify(Model.files));
  };


  return Model;
 });