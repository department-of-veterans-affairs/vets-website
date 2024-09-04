import {
  OMB_INFO_LOADED,
  ombInfoLoaded,
} from 'applications/form-renderer/actions/ombInfo';
import { expect } from 'chai';

describe('ombInfo actions', () => {
  describe('ombInfoLoaded', () => {
    it('creates an OMB_INFO_LOADED action', () => {
      const ombInfo = {
        expDate: '8/29/2025',
        ombNumber: '1212-1212',
        resBurden: 30,
      };

      const expectedAction = {
        type: OMB_INFO_LOADED,
        payload: { ombInfo },
      };

      expect(ombInfoLoaded(ombInfo)).to.deep.eq(expectedAction);
    });
  });
});
