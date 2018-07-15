# simpleWaveFormJS

Easy wrapper for [audiowaveform](https://github.com/bbc/audiowaveform)

Output normalized waveform data (between 0 and 1)

## Install

```npm install --save https://github.com/Guisch/simpleWaveformJs.git```

## Example

```
var wf = require('simplewaveformjs');

wf.getWaveform('input.mp3', function(res) {
  console.log(res);
});
```
