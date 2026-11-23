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

    // p5.sound 0.3.2 only knows the legacy callback API, which Safari
    // doesn't have. Point it at mediaDevices.getUserMedia instead.
    if (!navigator.getUserMedia && navigator.mediaDevices) {
      navigator.getUserMedia = function (constraints, onStream, onError) {
        navigator.mediaDevices.getUserMedia(constraints).then(onStream, onError);
      };
    }
    if (!navigator.getUserMedia) {
      fail('This browser can’t capture audio. Serve the page over HTTPS or from localhost.');
      return;
    }

    message.textContent = 'Waiting for microphone permission…';
    getAudioContext().resume().then(function () {
      input.start(function () {
        gate.remove();
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
