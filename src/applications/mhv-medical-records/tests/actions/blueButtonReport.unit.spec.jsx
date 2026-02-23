import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { subYears, addMonths, format } from 'date-fns';
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

          const [fromDateArg, toDateArg] = getAppointmentsStub.firstCall.args;
          expect(fromDateArg).to.not.be.null;
          expect(toDateArg).to.not.be.null;
          expect(getAppointmentsStub.calledOnce).to.be.true;

          expect(dispatch.calledOnce).to.be.true;
          const dispatchedAction = dispatch.firstCall.args[0];
          expect(dispatchedAction.type).to.equal(Actions.BlueButtonReport.GET);
          expect(dispatchedAction.appointmentsResponse).to.deep.equal(mockData);

          getAppointmentsStub.restore();
        });

        it('should fetch appointments with the provided custom dateFilter range', async () => {
          const mockData = { mockData: 'appointmentsMockData' };
          const getAppointmentsStub = sinon
            .stub(MrApi, 'getAppointments')
            .resolves(mockData);

          const dispatch = sinon.spy();
          const action = getBlueButtonReportData(
            { appointments: true },
            { fromDate: '2021-06-01', toDate: '2021-12-31' },
          );
          await action(dispatch);

          const [fromDateArg, toDateArg] = getAppointmentsStub.firstCall.args;
          expect(fromDateArg).to.not.be.null;
          expect(toDateArg).to.not.be.null;
          expect(getAppointmentsStub.calledOnce).to.be.true;

          expect(dispatch.calledOnce).to.be.true;
          const dispatchedAction = dispatch.firstCall.args[0];
          expect(dispatchedAction.type).to.equal(Actions.BlueButtonReport.GET);
          expect(dispatchedAction.appointmentsResponse).to.deep.equal(mockData);

          getAppointmentsStub.restore();
        });

        it('should NOT fetch appointments if selected dateFilter is more than 2 years past', async () => {
          const mockData = { mockData: 'appointmentsMockData' };
          const getAppointmentsStub = sinon
            .stub(MrApi, 'getAppointments')
            .resolves(mockData);

          const dispatch = sinon.spy();
          const action = getBlueButtonReportData(
            { appointments: true },
            {
              fromDate: format(subYears(new Date(), 4), 'yyyy-MM-dd'),
              toDate: format(subYears(new Date(), 3), 'yyyy-MM-dd'),
            },
          );
          await action(dispatch);

          expect(getAppointmentsStub.called).to.not.be.true;

          expect(dispatch.calledOnce).to.be.true;
          const dispatchedAction = dispatch.firstCall.args[0];
          expect(dispatchedAction.type).to.equal(Actions.BlueButtonReport.GET);

          getAppointmentsStub.restore();
        });

        it('should NOT fetch appointments if selected dateFilter is more than 13 months future', async () => {
          const mockData = { mockData: 'appointmentsMockData' };
          const getAppointmentsStub = sinon
            .stub(MrApi, 'getAppointments')
            .resolves(mockData);

          const dispatch = sinon.spy();
          const action = getBlueButtonReportData(
            { appointments: true },
            {
              fromDate: format(addMonths(new Date(), 14), 'yyyy-MM-dd'),
              toDate: format(addMonths(new Date(), 16), 'yyyy-MM-dd'),
            },
          );
          await action(dispatch);

          expect(getAppointmentsStub.called).to.not.be.true;

          expect(dispatch.calledOnce).to.be.true;
          const dispatchedAction = dispatch.firstCall.args[0];
          expect(dispatchedAction.type).to.equal(Actions.BlueButtonReport.GET);

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
