var exec = require('child_process').exec;
var path = require('path');

const precision = 100;

var getWaveform = function(input, callback) {
  exec('ffprobe -show_streams "' + input + '"', function(err, stdout, stderr) {
    if (err) {
      console.log('Error when gettin duration', err);
      return callback();
    }

    var durationRegex = /duration=(.*)/i

    if (durationRegex.test(stdout)) {
      var duration = parseInt(durationRegex.exec(stdout)[1]);
      var width = precision * duration;
      var args = ['-i', "'" + input + "'", '-o', path.join(__dirname, 'sample.json'), '--pixels-per-second', precision.toString(), '-w', width.toString()];

      exec('audiowaveform ' + args.join(' '), function(err, stdout, stderr) {
        if (err || stderr) {
          console.log('Error when generating waveform', err, stderr);
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
          output[i] = parseFloat((1 - ((output[i] - min) / (max - min))).toFixed(3));
        }

        return callback(output);
      });
    }
  });
}

exports.getWaveform = getWaveform;
