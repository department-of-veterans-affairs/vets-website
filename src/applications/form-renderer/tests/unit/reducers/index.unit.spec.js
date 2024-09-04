import { initialState } from 'applications/form-renderer/reducers/form-load';
import reducers from 'applications/form-renderer/reducers';
import { expect } from 'chai';

describe('form-renderer reducers', () => {
  it('should include the form load reducer', () => {
    expect(reducers.formLoad()).to.deep.equal(initialState);
  });
});
