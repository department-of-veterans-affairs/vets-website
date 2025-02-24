import { expect } from 'chai';
import { createInitialState } from 'platform/forms-system/src/js/state/helpers';
import formConfig from '../config/form';
import { createSaveInProgressFormReducer, setFormVersion } from '../reducers';

describe('Burials reducers', () => {
  it('update the form version and migrations count on setFormVersion', () => {
    const reducer = createSaveInProgressFormReducer(formConfig);
    const newState = reducer(createInitialState(formConfig), setFormVersion(3));
    expect(newState.migrations).to.have.length(3);
    expect(newState.version).to.equal(3);
  });
});
