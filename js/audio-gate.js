// Starts a p5.AudioIn only after a click. Browsers keep the AudioContext
// suspended until a user gesture, so calling mic.start() in setup() leaves
// the sketch silent. Call audioGate(mic) in place of mic.start().
function audioGate(input) {
  var gate = document.createElement('div');
  gate.className = 'audio-gate';

  var button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Click to start audio';

  var message = document.createElement('p');
  message.setAttribute('role', 'alert');

  gate.appendChild(button);
  gate.appendChild(message);
  document.body.appendChild(gate);
  button.focus();

  button.addEventListener('click', function () {
    button.disabled = true;
    message.textContent = '';

    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      fail('This browser can’t capture audio. Serve the page over HTTPS or from localhost.');
      return;
    }

    // p5.sound 1.0.1's level meter expects stereo and stops working when
    // Firefox passes a mono mic through as one channel. Upmixing at the
    // input's output node keeps getLevel() alive in every browser.
    input.output.channelCount = 2;
    input.output.channelCountMode = 'explicit';

    message.textContent = 'Waiting for microphone permission…';
    userStartAudio().then(function () {
      input.start(function () {
        gate.remove();
        sensitivity(input);
      }, function (err) {
        fail(err && err.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow it in the browser’s site settings, then try again.'
          : 'No microphone could be opened (' + (err && err.name || 'unknown error') + ').');
      });
    });
  });

  function fail(text) {
    message.textContent = text;
    button.disabled = false;
    button.textContent = 'Try again';
  }
}
