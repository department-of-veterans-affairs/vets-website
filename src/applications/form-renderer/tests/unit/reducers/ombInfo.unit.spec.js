import { expect } from 'chai';
import reducer, {
  initialState,
} from 'applications/form-renderer/reducers/ombInfo';

describe('ombInfo reducer', () => {
  it('should return the initial state', () => {
    expect(reducer()).to.deep.equal(initialState);
  });
});
