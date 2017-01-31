app.factory('fullscreen', function($document, Music) {

  var content = '';
  var lineAnalysis = [];
  var manualColumnBreaks = {};

  var lineHeightSampleDiv = angular.element($document[0].createElement('div'));
  lineHeightSampleDiv.attr('id', 'lineHeightSample'); // for css
  lineHeightSampleDiv.text('sample');
  $document.find('body').append(lineHeightSampleDiv);

  var mainDiv = angular.element($document[0].createElement('div'));
  mainDiv.attr('id', 'fullscreen'); // for css
  mainDiv.on('click', endFullscreen);
  mainDiv.append('<span class="tips">click on lines to adjust column-breaks<br>click on white-space to close modal</span>');
  $document.find('body').append(mainDiv);

  function endFullscreen() {
    mainDiv.css('display', 'none');
    $(window).off('resize');
  }

  function startFullscreen(content_) {
    content = content_;
    manualColumnBreaks = {}
    doLineAnalysis();
    flow();
    mainDiv.css('display', 'block');
    $(window).on('resize', flow);
  }

  function doLineAnalysis() {
    // analyze lines for future flowing
    lineAnalysis = [];
    _.each(content.split(/\n/), function(line, lineIndex) {
      if (line.match(/^\s*$/)) {
        lineAnalysis[lineIndex] = 'blank';
      }
      else {
        var thisLineAnalysis = Music.doLineAnalysis(line);
        lineAnalysis[lineIndex] = (thisLineAnalysis === 1) ? 'chords' : 'lyrics';
        if (lineIndex > 0 && lineAnalysis[lineIndex - 1] === 'chords' && lineAnalysis[lineIndex] === 'lyrics') {
          lineAnalysis[lineIndex] = 'lyrics-after-chords';
        }
      }
    });
  }

  function flow() {
    var lineHeight = $('#lineHeightSample').height();
    var maxRows = Math.floor(($(window).height() - 15 * 2) / lineHeight);
    var columns = [[]];
    var lines = content.split(/\n/);
    var lineIndexCursor = -1;
    while (lineIndexCursor < lines.length - 1) {
      lineIndexCursor += 1;
      // manual column break?
      if (manualColumnBreaks[lineIndexCursor]) {
        columns.push([]); // break flow column
      }
      columns[columns.length-1].push(lines[lineIndexCursor]);
      if (columns[columns.length-1].length === maxRows) {
        columns.push([]); // break flow column
        // try to avoid breaking on a 'lyrics-after-chords' line
        if (lineIndexCursor < lines.length - 1 && lineAnalysis[lineIndexCursor + 1] === 'lyrics-after-chords') {
          columns[columns.length-1].push( columns[columns.length-2].pop() );
        }
      }
    }
    // show results
    mainDiv.find('div').remove(); // remove any old flowed content
    lineIndexCursor = 0;
    _.each(columns, function(columnLines) {
      var columnElement = $('<div></div>');
      _.each(columnLines, function(columnLine) {
        var lineElement = $('<div></div>');
        lineElement.text(columnLine + ' '); // add space to ensure blank lines render
        lineElement.data('i', lineIndexCursor);
        if (lineAnalysis[lineIndexCursor] === 'chords') {
          lineElement.addClass('chords');
        }
        lineElement.on('click', function() {
          var lineIndex = $(this).data('i');
          _.each(_.range(lineIndex - 10, lineIndex + 10), function(nearbyLineIndex) {
            manualColumnBreaks[nearbyLineIndex] = false;
          });
          manualColumnBreaks[lineIndex] = true;
          flow();
          return false; // prevent parent div from getting event
        });
        lineElement.appendTo(columnElement);
        lineIndexCursor += 1; // keep count
      });
      columnElement.appendTo(mainDiv);
    });
    mainDiv.attr('display', 'block'); // show!
  }

  // api
  return {
    start: startFullscreen
  };
});
