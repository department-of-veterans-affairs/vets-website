import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import {
  getBlueButtonReportData,
  clearFailedList,
} from '../../actions/blueButtonReport';
import { Actions } from '../../util/actionTypes';
import allergies from '../fixtures/allergies.json';

describe('Blue Button Actions', () => {
  describe('getBlueButtonReportData', () => {
    it('should only get the domains that are specified in the options', async () => {
      const mockData = allergies;
      mockApiRequest(mockData);
      const dispatch = sinon.spy();

      const action = getBlueButtonReportData({ allergies: true });
      await action(dispatch);
      // Verify that dispatch was called only once
      expect(dispatch.calledOnce).to.be.true;

      // Check the first and only dispatch action type
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });
    describe('should get only that domain', () => {
      it('should get allergies', async () => {
        const mockData = allergies;
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ allergies: true });
        await action(dispatch);
        // Verify that dispatch was called only once
        expect(dispatch.calledOnce).to.be.true;

        // Check the first and only dispatch action type
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Allergies.GET_LIST,
        );
      });
      it('should get labsAndTests', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ labsAndTests: true });
        await action(dispatch);
        // Verify that dispatch was called only once
        expect(dispatch.calledOnce).to.be.true;

        // Check the first and only dispatch action type
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.LabsAndTests.GET_LIST,
        );
      });

      it('should get radiology', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ radiology: true });
        await action(dispatch);
        // Verify that dispatch was called only once
        expect(dispatch.calledOnce).to.be.true;

        // Check the first and only dispatch action type
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.LabsAndTests.GET_LIST,
        );
      });

      it('should get notes', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ notes: true });
        await action(dispatch);
        // Verify that dispatch was called only once
        expect(dispatch.calledOnce).to.be.true;

        // Check the first and only dispatch action type
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.CareSummariesAndNotes.GET_LIST,
        );
      });

      it('should get vaccines', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ vaccines: true });
        await action(dispatch);
        // Verify that dispatch was called only once
        expect(dispatch.calledOnce).to.be.true;

        // Check the first and only dispatch action type
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Vaccines.GET_LIST,
        );
      });
      it('should get conditions', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ conditions: true });
        await action(dispatch);
        // Verify that dispatch was called only once
        expect(dispatch.calledOnce).to.be.true;

        // Check the first and only dispatch action type
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Conditions.GET_LIST,
        );
      });
      it('should get vitals', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ vitals: true });
        await action(dispatch);
        // Verify that dispatch was called only once
        expect(dispatch.calledOnce).to.be.true;

        // Check the first and only dispatch action type
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Vitals.GET_LIST,
        );
      });

      it('should trigger the same action for medications, appointments, demographics, militaryService, or patient', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const actions = [
          'medications',
          'appointments',
          'demographics',
          'militaryService',
          'patient',
        ];
        actions.forEach(async actionType => {
          const action = getBlueButtonReportData({ [actionType]: true });
          await action(dispatch);
          // Verify that dispatch was called only once
          expect(dispatch.calledOnce).to.be.true;

          // Check the first and only dispatch action type
          expect(dispatch.firstCall.args[0].type).to.equal(
            Actions.BlueButtonReport.GET,
          );
        });
      });
    });

    it('should not dispatch any actions if no options are enabled', async () => {
      const dispatch = sinon.spy();
      const action = getBlueButtonReportData({});
      await action(dispatch);
      // Assert that dispatch was never called
      expect(dispatch.notCalled).to.be.true;
    });

    it('should dispatch an error for a failed API call', async () => {
      const mockData = allergies;
      mockApiRequest(mockData, false); // Unresolved promise
      const dispatch = sinon.spy();
      const action = getBlueButtonReportData({ allergies: true });
      await action(dispatch);
      // Verify that dispatch was called only once
      expect(dispatch.calledOnce).to.be.true;

      // Check the first and only dispatch action type
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.BlueButtonReport.ADD_FAILED,
      );
    });

    it('should dispatch combined labsAndTests and radiology responses in a single action', async () => {
      const mockData = { mockData: 'mockData' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();

      const action = getBlueButtonReportData({
        labsAndTests: true,
        radiology: true,
      });
      await action(dispatch);
      // Verify dispatch was called once for the combined action
      expect(dispatch.calledOnce).to.be.true;

      const dispatchedAction = dispatch.firstCall.args[0];
      expect(dispatchedAction.type).to.equal(Actions.LabsAndTests.GET_LIST);
      expect(dispatchedAction.labsAndTestsResponse).to.deep.equal(mockData);
      expect(dispatchedAction.radiologyResponse).to.deep.equal(mockData);
    });
  });
  describe('ClearFailedList', () => {
    it('should dispatch an action of type ClearFailedList', () => {
      const dispatch = sinon.spy();
      clearFailedList({ sample: 'test' })(dispatch);
      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.BlueButtonReport.CLEAR_FAILED,
      );
      expect(dispatch.firstCall.args[0].payload).to.deep.equal({
        sample: 'test',
      });
    });
  });
});
