var spawn = require('child_process').spawn;
var path = require('path');

var getWaveform = function(input, callback) {
  var ffprobe = spawn('ffprobe', [input, '-show_streams']);

  ffprobe.stdout.on('data', function(data) {
    data = data.toString();
    var durationRegex = /duration=(.*)/i

    if (durationRegex.test(data)) {
      var duration = parseInt(durationRegex.exec(data)[1]);
      var width = 10 * duration;
      var args = ['-i', input, '-o', path.join(__dirname, 'sample.json'), '--pixels-per-second', '10', '-w', width.toString()];

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
        for (var i = 0; i < jsonOutput.data.length; i+=2) {
          output.push(jsonOutput.data[i]);
        }
        var min = Math.min(...output);
        var max = Math.max(...output);

        for(var i = 0; i < output.length; i++) {
          output[i] = (1 - ((output[i] - min) / (max - min))).toFixed(3);
        }

        return callback(output);
      });
    }
  });

  ffprobe.on('exit', function(code) {
    if (code.toString() != '0') {
      console.log('Error when getting duration');
      return callback();
    }
  });
}

exports.getWaveform = getWaveform;
