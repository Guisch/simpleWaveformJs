var spawn = require('child_process').spawn;
var path = require('path');

var getWaveform = function(input, callback) {
  var args = ['-i', input, '-o', path.join(__dirname, 'sample.json'), '-b', '8'];

  var wf = spawn('audiowaveform', args);

  wf.stderr.on('data', function(data) {
    console.log('Error when generating Waveform:', data.toString());
  });

  wf.on('exit', function(code) {
    if (code.toString() != '0') {
      console.log('Error when generating Waveform');
      return callback();
    }

    var jsonOutput = require(path.join(__dirname, 'sample.json'));
    var output = [];
    for(var i = 0; i < jsonOutput.data.length; i++) {
      output[i] = (jsonOutput.data[i]+127)/254;
    }

    return callback(output);
  });
}

exports.getWaveform = getWaveform;
