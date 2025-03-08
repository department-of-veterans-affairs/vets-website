import { expect } from 'chai';
import reducers from '../../../reducers';
import { initialState as formLoadInitialState } from '../../../reducers/form-load';

describe('form-renderer reducers', () => {
  it('should include the form load reducer', () => {
    expect(reducers.formLoad()).to.deep.equal(formLoadInitialState);
  });
});
