import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { getBlueButtonReportData } from '../../actions/blueButtonReport';
import { Actions } from '../../util/actionTypes';
import allergies from '../fixtures/allergies.json';

describe('getBlueButtonReportData', () => {
  it('should only get the domains that are specified in the options', () => {
    const mockData = allergies;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getBlueButtonReportData({ allergies: true })(dispatch).then(() => {
      // Verify that dispatch was called only once
      expect(dispatch.calledOnce).to.be.true;

      // Check the first and only dispatch action type
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });
  });

  it('should not dispatch any actions if no options are enabled', () => {
    const dispatch = sinon.spy();
    return getBlueButtonReportData({})(dispatch).then(() => {
      // Assert that dispatch was never called
      expect(dispatch.notCalled).to.be.true;
    });
  });
});
