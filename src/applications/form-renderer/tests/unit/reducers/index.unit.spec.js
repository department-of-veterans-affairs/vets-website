import { expect } from 'chai';
import reducers from 'applications/form-renderer/reducers';
import { initialState as formLoadInitialState } from 'applications/form-renderer/reducers/form-load';
import { initialState as ombInfoInitialState } from 'applications/form-renderer/reducers/ombInfo';

describe('form-renderer reducers', () => {
  it('should include the form load reducer', () => {
    expect(reducers.formLoad()).to.deep.equal(formLoadInitialState);
  });

  it('should include the ombInfo reducer', () => {
    expect(reducers.ombInfo()).to.deep.equal(ombInfoInitialState);
  });
});
