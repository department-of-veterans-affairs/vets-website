/* eslint no-console: 0 */
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
    console.log('Inclusive');
    Perf.printInclusive(measurements);
    console.log('Exclusive');
    Perf.printExclusive(measurements);
    console.log('Wasted');
    Perf.printWasted(measurements);
    console.log('DOM');
    Perf.printOperations(measurements);
  }

  render() {
    return (
      <div className="row panel">
        <div className="small-4 columns">
          <h3>Perf Controls</h3>
        </div>
        <div className="small-4 columns">
          <button
            className="usa-button-primary"
            onClick={this.handleStart}>Start</button>
        </div>
        <div className="small-4 columns">
          <button
            className="usa-button-primary"
            onClick={this.handleStop}>Stop</button>
        </div>
      </div>
    );
  }
}

export default PerfPanel;
