import { expect } from 'chai';
import { alertsReducer } from '../../reducers/alerts';
import * as Constants from '../../util/constants';
import { Actions } from '../../util/actionTypes';

describe('alertsReducer function', () => {
  const prevState = {
    alertList: [
      {
        datestamp: new Date(),
        isActive: true,
        type: 'error',
        errorMessage: 'An error',
        errorStackTrace:
          'Error: An error\n' +
          '    at Context.<anonymous> (/Users/matthewwright/Projects/va/vets-website/src/applications/mhv/medical-records/tests/reducers/alerts.unit.spec.js:13:16)\n' +
          '    at callFn (/Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runnable.js:366:21)\n' +
          '    at Test.Runnable.run (/Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runnable.js:354:5)\n' +
          '    at Test.Runnable.run (/Users/matthewwright/Projects/va/vets-website/node_modules/mocha-snapshots/src/index.js:19:22)\n' +
          '    at Runner.runTest (/Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runner.js:666:10)\n' +
          '    at /Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runner.js:789:12\n' +
          '    at next (/Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runner.js:581:14)\n' +
          '    at /Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runner.js:591:7\n' +
          '    at next (/Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runner.js:474:14)\n' +
          '    at Immediate._onImmediate (/Users/matthewwright/Projects/va/vets-website/node_modules/mocha/lib/runner.js:559:5)\n' +
          '    at processImmediate (internal/timers.js:461:21)\n' +
          '    at process.callbackTrampoline (internal/async_hooks.js:129:14)',
      },
    ],
  };

  it('should return initial state with new alert when case is ADD_ALERT', () => {
    const action = {
      type: Actions.Alerts.ADD_ALERT,
      payload: {
        type: Constants.ALERT_TYPE_ERROR,
        error: new Error('Another error'),
      },
    };
    const state = alertsReducer(prevState, action);
    const activeError = state.alertList[state.alertList.length - 1];
    expect(activeError.datestamp).to.exist;
    expect(activeError.isActive).to.eq(true);
    expect(activeError.type).to.eq('error');
    expect(activeError.errorMessage).to.eq('Another error');
    expect(activeError.errorStackTrace.slice(0, 21)).to.eq(
      'Error: Another error\n',
    );
  });

  it('should set all alerts to inactive when case is CLEAR_ALERT', () => {
    const action = { type: Actions.Alerts.CLEAR_ALERT };
    const state = alertsReducer(prevState, action);
    expect(state.alertList.every(item => item.isActive === false)).to.be.true;
  });
});
