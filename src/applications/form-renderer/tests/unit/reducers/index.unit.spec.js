import { expect } from 'chai';
import reducers from 'applications/form-renderer/reducers';
import { initialState as formLoadInitialState } from 'applications/form-renderer/reducers/form-load';

describe('form-renderer reducers', () => {
  it('should include the form load reducer', () => {
    expect(reducers.formLoad()).to.deep.equal(formLoadInitialState);
  });
});
