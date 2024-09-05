import { expect } from 'chai';
import reducer, {
  initialState,
} from 'applications/form-renderer/reducers/ombInfo';
import { ombInfoLoaded } from 'applications/form-renderer/actions/ombInfo';

describe('ombInfo reducer', () => {
  it('should return the initial state', () => {
    expect(reducer()).to.deep.equal(initialState);
  });

  it('should handle OMB_INFO_LOADED', () => {
    const ombInfo = {
      expDate: '8/29/2025',
      ombNumber: '1212-1212',
      resBurden: 30,
    };
    const action = ombInfoLoaded(ombInfo);

    expect(reducer(initialState, action)).to.deep.equal(ombInfo);
  });
});
