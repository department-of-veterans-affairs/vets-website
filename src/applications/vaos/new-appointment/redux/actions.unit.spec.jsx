import { expect } from 'chai';
import sinon from 'sinon';

import {
  routeToPageInFlow,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
  getAppointmentSlots,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_UPDATE_FACILITY_EHR,
  START_DIRECT_SCHEDULE_FLOW,
  START_REQUEST_APPOINTMENT_FLOW,
  FORM_CALENDAR_FETCH_SLOTS,
  FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
  FORM_CALENDAR_FETCH_SLOTS_FAILED,
} from './actions';
import { APPOINTMENT_SYSTEM } from '../../utils/constants';
import * as locationService from '../../services/location';
import * as slotService from '../../services/slot';
import * as selectors from './selectors';

const testFlow = {
  page1: {
    next: 'page2',
  },
  page2: {
    url: '/page2',
    next: () => 'page3',
  },
  page3: {
    url: '/page3',
    next: 'page4',
  },
};

describe('VAOS newAppointment actions', () => {
  describe('routeToPageInFlow', () => {
    it('should route to next page with string key', async () => {
      const history = {
        push: sinon.spy(),
      };
      const dispatch = sinon.spy();
      const state = {};
      const getState = () => state;
      const data = {};
      const getTestFlow = () => testFlow;

      const thunk = routeToPageInFlow(
        getTestFlow,
        history,
        'page2',
        'next',
        data,
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FORM_PAGE_CHANGE_STARTED,
        pageKey: 'page2',
        data,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: FORM_PAGE_CHANGE_COMPLETED,
        pageKey: 'page2',
        pageKeyNext: 'page3',
        direction: 'next',
      });
      expect(history.push.firstCall.args[0]).to.equal('/page3');
    });

    it('should route to next page with function', async () => {
      const history = {
        push: sinon.spy(),
      };
      const dispatch = sinon.spy();
      const state = {};
      const getState = () => state;
      const getTestFlow = () => testFlow;

      const thunk = routeToPageInFlow(getTestFlow, history, 'page2', 'next');
      await thunk(dispatch, getState);

      expect(history.push.firstCall.args[0]).to.equal('/page3');
    });

    it('should throw error for bad state', done => {
      const history = {
        push: sinon.spy(),
      };
      const dispatch = sinon.spy();
      const state = {};
      const getState = () => state;
      const getTestFlow = () => testFlow;

      const thunk = routeToPageInFlow(getTestFlow, history, 'page3', 'next');

      thunk(dispatch, getState)
        .then(() => {
          done('Did not throw error for bad state');
        })
        .catch(e => {
          expect(e.message).to.equal(
            'Tried to route to page that does not exist',
          );
          done();
        });
    });

    it('should route to previous page', async () => {
      const history = {
        push: sinon.spy(),
        location: { pathname: '' },
      };
      const dispatch = sinon.spy();
      const state = {
        newAppointment: {
          previousPages: { page1: 'home', page2: 'page1', page3: 'page2' },
        },
      };
      const getState = () => state;
      const data = {};
      const getTestFlow = () => testFlow;

      const thunk = routeToPageInFlow(
        getTestFlow,
        history,
        'page3',
        'previous',
        data,
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FORM_PAGE_CHANGE_STARTED,
        pageKey: 'page3',
        data,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: FORM_PAGE_CHANGE_COMPLETED,
        pageKey: 'page3',
        pageKeyNext: undefined,
        direction: 'previous',
      });
      expect(history.push.firstCall.args[0]).to.equal('/page2');
    });
  });

  describe('startDirectScheduleFlow', () => {
    beforeEach(() => {
      global.window.dataLayer = [];
    });

    it('should dispatch START_DIRECT_SCHEDULE_FLOW and record vista event when ehr is vista', async () => {
      const dispatch = sinon.spy();

      const thunk = startDirectScheduleFlow({ ehr: APPOINTMENT_SYSTEM.vista });
      await thunk(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: START_DIRECT_SCHEDULE_FLOW,
      });
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-direct-vista-path-started',
      });
    });

    it('should dispatch START_DIRECT_SCHEDULE_FLOW and record cerner event when ehr is cerner', async () => {
      const dispatch = sinon.spy();

      const thunk = startDirectScheduleFlow({ ehr: APPOINTMENT_SYSTEM.cerner });
      await thunk(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: START_DIRECT_SCHEDULE_FLOW,
      });
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-direct-cerner-path-started',
      });
    });

    it('should not record event when no ehr param is passed', async () => {
      const dispatch = sinon.spy();

      const thunk = startDirectScheduleFlow();
      await thunk(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(global.window.dataLayer.length).to.equal(0);
    });

    it('should not record event when isRecordEvent is false', async () => {
      const dispatch = sinon.spy();

      const thunk = startDirectScheduleFlow({
        isRecordEvent: false,
        ehr: APPOINTMENT_SYSTEM.vista,
      });
      await thunk(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(global.window.dataLayer.length).to.equal(0);
    });
  });

  describe('startRequestAppointmentFlow', () => {
    beforeEach(() => {
      global.window.dataLayer = [];
    });

    it('should dispatch START_REQUEST_APPOINTMENT_FLOW and record vista request event', async () => {
      const dispatch = sinon.spy();

      const thunk = startRequestAppointmentFlow({
        ehr: APPOINTMENT_SYSTEM.vista,
      });
      await thunk(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: START_REQUEST_APPOINTMENT_FLOW,
      });
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-request-vista-path-started',
      });
    });

    it('should dispatch START_REQUEST_APPOINTMENT_FLOW and record cerner request event', async () => {
      const dispatch = sinon.spy();

      const thunk = startRequestAppointmentFlow({
        ehr: APPOINTMENT_SYSTEM.cerner,
      });
      await thunk(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: START_REQUEST_APPOINTMENT_FLOW,
      });
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-request-cerner-path-started',
      });
    });

    it('should dispatch updateFacilityEhr and record hsrm event for community care', async () => {
      const dispatch = sinon.spy();

      const thunk = startRequestAppointmentFlow({
        ehr: APPOINTMENT_SYSTEM.hsrm,
      });
      await thunk(dispatch);

      expect(dispatch.calledTwice).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FORM_UPDATE_FACILITY_EHR,
        ehr: APPOINTMENT_SYSTEM.hsrm,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: START_REQUEST_APPOINTMENT_FLOW,
      });
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-request-hsrm-path-started',
      });
    });

    it('should not record event when no ehr param is passed', async () => {
      const dispatch = sinon.spy();

      const thunk = startRequestAppointmentFlow();
      await thunk(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(global.window.dataLayer.length).to.equal(0);
    });
  });

  describe('getAppointmentSlots', () => {
    let sandbox;
    let getSiteIdFromFacilityIdStub;
    let getSlotsStub;
    let getNewAppointmentStub;
    let getTypeOfCareStub;
    let getFormDataStub;
    let selectAppointmentEhrStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      getSiteIdFromFacilityIdStub = sandbox.stub(
        locationService,
        'getSiteIdFromFacilityId',
      );
      getSlotsStub = sandbox.stub(slotService, 'getSlots');
      getNewAppointmentStub = sandbox.stub(selectors, 'getNewAppointment');
      getTypeOfCareStub = sandbox.stub(selectors, 'getTypeOfCare');
      getFormDataStub = sandbox.stub(selectors, 'getFormData');
      selectAppointmentEhrStub = sandbox.stub(
        selectors,
        'selectAppointmentEhr',
      );
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should use full facility ID (653BY) for Cerner/OH appointments', async () => {
      const fullFacilityId = '653BY';
      const parentSiteId = '653';
      const dispatch = sinon.spy();
      const mockSlots = [
        {
          start: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          end: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
        },
      ];

      getSiteIdFromFacilityIdStub.returns(parentSiteId);
      getSlotsStub.resolves(mockSlots);
      getNewAppointmentStub.returns({
        data: { clinicId: 'clinic123' },
        fetchedAppointmentSlotMonths: [],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'primaryCare' });
      getFormDataStub.returns({ vaFacility: fullFacilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.cerner);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31');
      await thunk(dispatch, getState);

      // Should use full facility ID (653BY) for Cerner/OH, NOT trimmed parent site ID (653)
      expect(getSlotsStub.calledOnce).to.be.true;
      expect(getSlotsStub.firstCall.args[0].siteId).to.equal(fullFacilityId);
      expect(getSiteIdFromFacilityIdStub.called).to.be.false;

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FORM_CALENDAR_FETCH_SLOTS,
      });
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
      );
    });

    it('should use trimmed parent site ID (653) for VistA appointments', async () => {
      const fullFacilityId = '653BY';
      const parentSiteId = '653';
      const dispatch = sinon.spy();
      const mockSlots = [
        {
          start: new Date(Date.now() + 86400000 * 2).toISOString(),
          end: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
        },
      ];

      getSiteIdFromFacilityIdStub.returns(parentSiteId);
      getSlotsStub.resolves(mockSlots);
      getNewAppointmentStub.returns({
        data: { clinicId: 'clinic123' },
        fetchedAppointmentSlotMonths: [],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'primaryCare' });
      getFormDataStub.returns({ vaFacility: fullFacilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.vista);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31');
      await thunk(dispatch, getState);

      // Should call getSiteIdFromFacilityId to trim 653BY to 653 for VistA
      expect(getSiteIdFromFacilityIdStub.calledOnce).to.be.true;
      expect(getSiteIdFromFacilityIdStub.firstCall.args[0]).to.equal(
        fullFacilityId,
      );
      expect(getSlotsStub.calledOnce).to.be.true;
      expect(getSlotsStub.firstCall.args[0].siteId).to.equal(parentSiteId);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FORM_CALENDAR_FETCH_SLOTS,
      });
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
      );
    });

    it('should skip fetch if month already fetched and not forced', async () => {
      const facilityId = '653BY';
      const dispatch = sinon.spy();

      getNewAppointmentStub.returns({
        data: { clinicId: 'clinic123' },
        fetchedAppointmentSlotMonths: ['2024-01'],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'primaryCare' });
      getFormDataStub.returns({ vaFacility: facilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.vista);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31', false);
      await thunk(dispatch, getState);

      // Should not call getSlots since month is already fetched
      expect(getSlotsStub.called).to.be.false;
      expect(dispatch.called).to.be.false;
    });

    it('should fetch even if month already fetched when forceFetch is true', async () => {
      const fullFacilityId = '653BY';
      const parentSiteId = '653';
      const dispatch = sinon.spy();
      const mockSlots = [
        {
          start: new Date(Date.now() + 86400000 * 2).toISOString(),
          end: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
        },
      ];

      getSiteIdFromFacilityIdStub.returns(parentSiteId);
      getSlotsStub.resolves(mockSlots);
      getNewAppointmentStub.returns({
        data: { clinicId: 'clinic123' },
        fetchedAppointmentSlotMonths: ['2024-01'],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'primaryCare' });
      getFormDataStub.returns({ vaFacility: fullFacilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.vista);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31', true);
      await thunk(dispatch, getState);

      // Should call getSlots even though month is fetched because forceFetch is true
      expect(getSlotsStub.calledOnce).to.be.true;
      expect(dispatch.calledTwice).to.be.true;
    });

    it('should filter out slots before tomorrow', async () => {
      const fullFacilityId = '653BY';
      const parentSiteId = '653';
      const dispatch = sinon.spy();
      const now = new Date();
      const mockSlots = [
        {
          start: new Date(now.getTime() - 86400000).toISOString(), // Yesterday
          end: new Date(now.getTime() - 86400000 + 3600000).toISOString(),
        },
        {
          start: new Date(now.getTime() + 3600000).toISOString(), // 1 hour from now (today)
          end: new Date(now.getTime() + 7200000).toISOString(),
        },
        {
          start: new Date(now.getTime() + 86400000 * 2).toISOString(), // 2 days from now
          end: new Date(now.getTime() + 86400000 * 2 + 3600000).toISOString(),
        },
      ];

      getSiteIdFromFacilityIdStub.returns(parentSiteId);
      getSlotsStub.resolves(mockSlots);
      getNewAppointmentStub.returns({
        data: { clinicId: 'clinic123' },
        fetchedAppointmentSlotMonths: [],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'primaryCare' });
      getFormDataStub.returns({ vaFacility: fullFacilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.vista);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31');
      await thunk(dispatch, getState);

      // Should only return slots after tomorrow (filtered out yesterday and today)
      const successAction = dispatch.secondCall.args[0];
      expect(successAction.availableSlots.length).to.equal(1);
      expect(successAction.availableSlots[0].start).to.equal(
        mockSlots[2].start,
      );
    });

    it('should dispatch FORM_CALENDAR_FETCH_SLOTS_FAILED on error', async () => {
      const fullFacilityId = '653BY';
      const parentSiteId = '653';
      const dispatch = sinon.spy();

      getSiteIdFromFacilityIdStub.returns(parentSiteId);
      getSlotsStub.rejects(new Error('Network error'));
      getNewAppointmentStub.returns({
        data: { clinicId: 'clinic123' },
        fetchedAppointmentSlotMonths: [],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'primaryCare' });
      getFormDataStub.returns({ vaFacility: fullFacilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.vista);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31');
      await thunk(dispatch, getState);

      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: FORM_CALENDAR_FETCH_SLOTS_FAILED,
      });
    });

    it('should pass typeOfCare and provider to getSlots for OH', async () => {
      const fullFacilityId = '653BY';
      const dispatch = sinon.spy();
      const mockProvider = { id: 'provider123' };
      const mockSlots = [
        {
          start: new Date(Date.now() + 86400000 * 2).toISOString(),
          end: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
        },
      ];

      getSlotsStub.resolves(mockSlots);
      getNewAppointmentStub.returns({
        data: { clinicId: 'clinic123', selectedProvider: mockProvider },
        fetchedAppointmentSlotMonths: [],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });
      getFormDataStub.returns({ vaFacility: fullFacilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.cerner);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31');
      await thunk(dispatch, getState);

      expect(getSlotsStub.calledOnce).to.be.true;
      const callArgs = getSlotsStub.firstCall.args[0];
      expect(callArgs.siteId).to.equal(fullFacilityId);
      expect(callArgs.typeOfCare).to.equal('foodAndNutrition');
      expect(callArgs.provider).to.deep.equal(mockProvider);
    });

    it('should pass clinicId to getSlots for VistA', async () => {
      const fullFacilityId = '653BY';
      const parentSiteId = '653';
      const clinicId = '653_308';
      const dispatch = sinon.spy();
      const mockSlots = [
        {
          start: new Date(Date.now() + 86400000 * 2).toISOString(),
          end: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
        },
      ];

      getSiteIdFromFacilityIdStub.returns(parentSiteId);
      getSlotsStub.resolves(mockSlots);
      getNewAppointmentStub.returns({
        data: { clinicId },
        fetchedAppointmentSlotMonths: [],
        availableSlots: [],
      });
      getTypeOfCareStub.returns({ idV2: 'primaryCare' });
      getFormDataStub.returns({ vaFacility: fullFacilityId });
      selectAppointmentEhrStub.returns(APPOINTMENT_SYSTEM.vista);

      const getState = () => ({});
      const thunk = getAppointmentSlots('2024-01-01', '2024-01-31');
      await thunk(dispatch, getState);

      expect(getSlotsStub.calledOnce).to.be.true;
      const callArgs = getSlotsStub.firstCall.args[0];
      expect(callArgs.siteId).to.equal(parentSiteId);
      expect(callArgs.clinicId).to.equal(clinicId);
    });
  });
});
