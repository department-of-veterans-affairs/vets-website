import React from 'react';
import Perf from 'react-addons-perf';

/**
 * Simple panel with buttons for manually starting/stopping perf measurements.
 *
 * Clicking stop will dump the results of the perf measurements into the Javascript Console.
 */
class PerfPanel extends React.Component {
  handleStart() {
    Perf.start();
  }
  handleStop() {
    Perf.stop();
    const measurements = Perf.getLastMeasurements();
    Perf.printInclusive(measurements);
    Perf.printExclusive(measurements);
    Perf.printWasted(measurements);
    Perf.printDOM(measurements);
  }

  render() {
    return (
      <div className="usa-grid panel">
        <div className="usa-grid-one-third">
          <h3>Perf Controls</h3>
        </div>
        <div className="usa-grid-one-third">
          <button
              className="usa-button-primary"
              onClick={this.handleStart}>Start</button>
        </div>
        <div className="usa-grid-one-third">
          <button
              className="usa-button-primary"
              onClick={this.handleStop}>Stop</button>
        </div>
      </div>
    );
  }
}

export default PerfPanel;
