import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import {
  clearFailedList,
  getSelfEnteredData,
} from '../../actions/selfEnteredData';
import { Actions } from '../../util/actionTypes';

describe('Download Actions', () => {
  describe('getSelfEnteredData', () => {
    it('should dispatch the correct action for each fetch', async () => {
      const dispatch = sinon.spy();
      mockApiRequest({ some: 'data' });
      await getSelfEnteredData()(dispatch);
      expect(dispatch.callCount).to.equal(14);
      const expectedActions = [
        Actions.SelfEntered.GET_ACTIVITY_JOURNAL,
        Actions.SelfEntered.GET_ALLERGIES,
        Actions.SelfEntered.GET_DEMOGRAPHICS,
        Actions.SelfEntered.GET_FAMILY_HISTORY,
        Actions.SelfEntered.GET_FOOD_JOURNAL,
        Actions.SelfEntered.GET_PROVIDERS,
        Actions.SelfEntered.GET_HEALTH_INSURANCE,
        Actions.SelfEntered.GET_TEST_ENTRIES,
        Actions.SelfEntered.GET_MEDICAL_EVENTS,
        Actions.SelfEntered.GET_MEDICATIONS,
        Actions.SelfEntered.GET_MILITARY_HISTORY,
        Actions.SelfEntered.GET_TREATMENT_FACILITIES,
        Actions.SelfEntered.GET_VACCINES,
        Actions.SelfEntered.GET_VITALS,
      ];

      expectedActions.forEach(action => {
        expect(
          dispatch.calledWith({
            type: action,
            payload: { some: 'data' },
          }),
        ).to.be.true;
      });
    });
  });

  describe('clearFailedList', () => {
    it('should dispatch an action', () => {
      const dispatch = sinon.spy();
      clearFailedList()(dispatch);
      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.SelfEntered.CLEAR_FAILED,
      );
    });
  });
});
