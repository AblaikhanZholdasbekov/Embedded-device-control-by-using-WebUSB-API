(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let redSlider = document.querySelector('#red');
    let greenSlider = document.querySelector('#green');
    let blueSlider = document.querySelector('#blue');
    let port;

    let startTime; // Track the start time for throughput calculation
    let totalBytesReceived = 0; // Track the total bytes received for throughput calculation

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = 'Successfully connected';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          let decodedData = textDecoder.decode(data);
          console.log(decodedData);

          // Update throughput calculation
          totalBytesReceived += decodedData.length;
          let currentTime = Date.now();
          let elapsedTimeInSeconds = (currentTime - startTime) / 1000;
          let throughput = totalBytesReceived / elapsedTimeInSeconds;
          console.log('Throughput: ' + throughput.toFixed(2) + ' bytes/sec');
        };

        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    function onUpdate() {
      if (!port) {
        return;
      }

      let view = new Uint8Array(3);
      view[0] = parseInt(redSlider.value);
      view[1] = parseInt(greenSlider.value);
      view[2] = parseInt(blueSlider.value);
      port.send(view);
    };

    redSlider.addEventListener('input', onUpdate);
    greenSlider.addEventListener('input', onUpdate);
    blueSlider.addEventListener('input', onUpdate);

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();

        // Start tracking time when the connection is established
        startTime = Date.now();
      }
    });
  });
})();
