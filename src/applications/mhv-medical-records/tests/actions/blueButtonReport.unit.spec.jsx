import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { formatISO, subYears, addMonths } from 'date-fns';
import {
  getBlueButtonReportData,
  clearFailedList,
} from '../../actions/blueButtonReport';
import { Actions } from '../../util/actionTypes';
import allergies from '../fixtures/allergies.json';
import * as MrApi from '../../api/MrApi';

describe('Blue Button Actions', () => {
  describe('getBlueButtonReportData', () => {
    it('should only get the domains that are specified in the options', async () => {
      const mockData = allergies;
      mockApiRequest(mockData);
      const dispatch = sinon.spy();

      // Only allergies is enabled, so no dateFilter is needed.
      const action = getBlueButtonReportData({ allergies: true });
      await action(dispatch);
      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });

    describe('should get only that domain', () => {
      it('should get allergies', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        const dispatch = sinon.spy();

        const action = getBlueButtonReportData({ allergies: true });
        await action(dispatch);
        expect(dispatch.calledOnce).to.be.true;
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
        expect(dispatch.calledOnce).to.be.true;
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
        expect(dispatch.calledOnce).to.be.true;
        // Radiology and labsAndTests are combined into one action
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
        expect(dispatch.calledOnce).to.be.true;
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
        expect(dispatch.calledOnce).to.be.true;
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
        expect(dispatch.calledOnce).to.be.true;
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
        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Vitals.GET_LIST,
        );
      });

      it('should trigger the same action for medications, demographics, militaryService, or patient', async () => {
        const mockData = { mockData: 'mockData' };
        mockApiRequest(mockData);
        // Exclude 'appointments' because its tests are handled separately
        const actionTypes = [
          'medications',
          'demographics',
          'militaryService',
          'patient',
        ];

        const promises = actionTypes.map(actionType => {
          const dispatch = sinon.spy();
          const action = getBlueButtonReportData({ [actionType]: true });
          return action(dispatch).then(() => {
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0].type).to.equal(
              Actions.BlueButtonReport.GET,
            );
          });
        });

        await Promise.all(promises);
      });

      describe('Appointments', () => {
        let clock;
        const fakeCurrentDate = new Date('2022-01-01T00:00:00Z');
        beforeEach(() => {
          // Only fake the Date API to avoid interfering with performance
          clock = sinon.useFakeTimers({
            now: fakeCurrentDate.getTime(),
            toFake: ['Date'],
          });
        });
        afterEach(() => {
          if (clock) {
            clock.restore();
          }
        });

        it('should fetch appointments with the correct date range when dateFilter.option is "any"', async () => {
          const mockData = { mockData: 'appointmentsMockData' };
          const getAppointmentsStub = sinon
            .stub(MrApi, 'getAppointments')
            .resolves(mockData);

          const dispatch = sinon.spy();
          const action = getBlueButtonReportData(
            { appointments: true },
            { option: 'any' },
          );
          await action(dispatch);

          expect(getAppointmentsStub.calledOnce).to.be.true;

          // The 'any' option should calculate fromDate as 2 years ago and toDate as 13 months in the future
          const currentDate = new Date();
          const dateTwoYearsAgo = subYears(currentDate, 2);
          const dateThirteenMonthsAhead = addMonths(currentDate, 13);

          const expectedFromDate = formatISO(dateTwoYearsAgo);
          const expectedToDate = formatISO(dateThirteenMonthsAhead);

          const [fromDateArg, toDateArg] = getAppointmentsStub.firstCall.args;
          expect(fromDateArg).to.equal(expectedFromDate);
          expect(toDateArg).to.equal(expectedToDate);

          expect(dispatch.calledOnce).to.be.true;
          const dispatchedAction = dispatch.firstCall.args[0];
          expect(dispatchedAction.type).to.equal(Actions.BlueButtonReport.GET);
          expect(dispatchedAction.appointmentsResponse).to.deep.equal(mockData);

          getAppointmentsStub.restore();
        });

        it('should fetch appointments with the provided custom dateFilter range (in range)', async () => {
          const mockData = { mockData: 'appointmentsMockData' };
          const getAppointmentsStub = sinon
            .stub(MrApi, 'getAppointments')
            .resolves(mockData);

          const fromDateCustom = '2021-06-01';
          const toDateCustom = '2021-12-31';
          const dispatch = sinon.spy();
          const action = getBlueButtonReportData(
            { appointments: true },
            { fromDate: fromDateCustom, toDate: toDateCustom },
          );
          await action(dispatch);

          expect(getAppointmentsStub.calledOnce).to.be.true;
          expect(getAppointmentsStub.firstCall.args[0]).to.equal(
            formatISO(new Date(fromDateCustom)),
          );
          expect(getAppointmentsStub.firstCall.args[1]).to.equal(
            formatISO(new Date(toDateCustom)),
          );

          expect(dispatch.calledOnce).to.be.true;
          const dispatchedAction = dispatch.firstCall.args[0];
          expect(dispatchedAction.type).to.equal(Actions.BlueButtonReport.GET);
          expect(dispatchedAction.appointmentsResponse).to.deep.equal(mockData);

          getAppointmentsStub.restore();
        });

        it('should clamp provided custom dateFilter range if dates are out of allowed boundaries', async () => {
          const mockData = { mockData: 'appointmentsMockData' };
          const getAppointmentsStub = sinon
            .stub(MrApi, 'getAppointments')
            .resolves(mockData);

          // Provide custom dates that are out-of-bounds
          const fromDateCustom = '2018-01-01';
          const toDateCustom = '2025-01-01';
          const dispatch = sinon.spy();
          const action = getBlueButtonReportData(
            { appointments: true },
            { fromDate: fromDateCustom, toDate: toDateCustom },
          );
          await action(dispatch);

          // With the fake current date of Jan 1, 2022,
          // allowed range is from 2 years ago (Jan 1, 2020) to 13 months ahead (Feb 1, 2023)
          const currentDate = new Date();
          const earliestAllowedFromDate = subYears(currentDate, 2);
          const latestAllowedToDate = addMonths(currentDate, 13);

          const expectedFromDate = formatISO(earliestAllowedFromDate);
          const expectedToDate = formatISO(latestAllowedToDate);

          expect(getAppointmentsStub.firstCall.args[0]).to.equal(
            expectedFromDate,
          );
          expect(getAppointmentsStub.firstCall.args[1]).to.equal(
            expectedToDate,
          );

          expect(dispatch.calledOnce).to.be.true;
          const dispatchedAction = dispatch.firstCall.args[0];
          expect(dispatchedAction.type).to.equal(Actions.BlueButtonReport.GET);
          expect(dispatchedAction.appointmentsResponse).to.deep.equal(mockData);

          getAppointmentsStub.restore();
        });
      });
    });

    it('should not dispatch any actions if no options are enabled', async () => {
      const dispatch = sinon.spy();
      const action = getBlueButtonReportData({});
      await action(dispatch);
      expect(dispatch.notCalled).to.be.true;
    });

    it('should dispatch an error for a failed API call', async () => {
      const mockData = allergies;
      mockApiRequest(mockData, false); // Simulate a failed request
      const dispatch = sinon.spy();
      const action = getBlueButtonReportData({ allergies: true });
      await action(dispatch);
      expect(dispatch.calledOnce).to.be.true;
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
