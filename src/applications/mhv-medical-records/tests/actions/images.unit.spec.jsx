import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  requestImages,
  setStudyRequestLimitReached,
} from '../../actions/images';
import { Actions } from '../../util/actionTypes';

// Helper to test studyRequestLimitReached logic
const checkLimitReached = error =>
  Array.isArray(error?.errors) &&
  error.errors.some(err =>
    err?.detail?.includes('You have exceeded your limit of three'),
  );

describe('Images actions', () => {
  describe('setStudyRequestLimitReached', () => {
    it('should dispatch SET_REQUEST_LIMIT_REACHED with payload', async () => {
      const dispatch = sinon.spy();

      await setStudyRequestLimitReached(true)(dispatch);
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Images.SET_REQUEST_LIMIT_REACHED,
        payload: true,
      });

      await setStudyRequestLimitReached(false)(dispatch);
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: Actions.Images.SET_REQUEST_LIMIT_REACHED,
        payload: false,
      });
    });
  });

  describe('requestImages', () => {
    it('should dispatch REQUEST_IMAGE_STUDY on success', async () => {
      const mockResponse = { data: { id: 'study-123' } };
      mockApiRequest(mockResponse);

      const dispatch = sinon.spy();
      await requestImages('study-123')(dispatch);

      const dispatchCalls = dispatch.getCalls();
      expect(dispatchCalls[0].args[0]).to.deep.equal({
        type: Actions.Images.SET_REQUEST_API_FAILED,
        payload: false,
      });
      expect(dispatchCalls[1].args[0].type).to.equal(
        Actions.Images.REQUEST_IMAGE_STUDY,
      );
    });

    it('should dispatch SET_REQUEST_API_FAILED on error', async () => {
      mockApiRequest({ message: 'Some error' }, false);

      const dispatch = sinon.spy();
      try {
        await requestImages('study-123')(dispatch);
      } catch (e) {
        // Expected to throw
      }

      const apiFailedCall = dispatch
        .getCalls()
        .find(
          call =>
            call.args[0].type === Actions.Images.SET_REQUEST_API_FAILED &&
            call.args[0].payload === true,
        );
      expect(apiFailedCall).to.exist;
    });
  });

  describe('studyRequestLimitReached check', () => {
    it('should detect limit reached when errors array contains limit message', () => {
      const error = {
        errors: [
          { detail: 'You have exceeded your limit of three image requests' },
        ],
      };
      expect(checkLimitReached(error)).to.be.true;
    });

    it('should return false and not crash for invalid error structures', () => {
      expect(checkLimitReached({ message: 'No errors array' })).to.be.false;
      expect(checkLimitReached({ errors: null })).to.be.false;
      expect(checkLimitReached({ errors: 'not an array' })).to.be.false;
      expect(checkLimitReached({ errors: [] })).to.be.false;
      expect(checkLimitReached({ errors: [{ detail: 'Other error' }] })).to.be
        .false;
    });
  });
});
