import { expect } from 'chai';
import sinon from 'sinon';

import {
  routeToPageInFlow,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  START_DIRECT_SCHEDULE_FLOW,
  START_REQUEST_APPOINTMENT_FLOW,
} from './actions';
import { APPOINTMENT_SYSTEM } from '../../utils/constants';

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
      const getState = () => ({
        newAppointment: { ehr: null },
      });

      const thunk = startDirectScheduleFlow({ ehr: APPOINTMENT_SYSTEM.vista });
      await thunk(dispatch, getState);

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
      const getState = () => ({
        newAppointment: { ehr: null },
      });

      const thunk = startDirectScheduleFlow({ ehr: APPOINTMENT_SYSTEM.cerner });
      await thunk(dispatch, getState);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: START_DIRECT_SCHEDULE_FLOW,
      });
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-direct-cerner-path-started',
      });
    });

    it('should fall back to state ehr when no ehr param is passed', async () => {
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: { ehr: APPOINTMENT_SYSTEM.cerner },
      });

      const thunk = startDirectScheduleFlow();
      await thunk(dispatch, getState);

      expect(dispatch.calledOnce).to.be.true;
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-direct-cerner-path-started',
      });
    });

    it('should not record event when isRecordEvent is false', async () => {
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: { ehr: null },
      });

      const thunk = startDirectScheduleFlow({
        isRecordEvent: false,
        ehr: APPOINTMENT_SYSTEM.vista,
      });
      await thunk(dispatch, getState);

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
      const getState = () => ({
        newAppointment: { ehr: null },
      });

      const thunk = startRequestAppointmentFlow(
        false,
        APPOINTMENT_SYSTEM.vista,
      );
      await thunk(dispatch, getState);

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
      const getState = () => ({
        newAppointment: { ehr: null },
      });

      const thunk = startRequestAppointmentFlow(
        false,
        APPOINTMENT_SYSTEM.cerner,
      );
      await thunk(dispatch, getState);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: START_REQUEST_APPOINTMENT_FLOW,
      });
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-request-cerner-path-started',
      });
    });

    it('should record community-care event with vista ehr', async () => {
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: { ehr: null },
      });

      const thunk = startRequestAppointmentFlow(true, APPOINTMENT_SYSTEM.vista);
      await thunk(dispatch, getState);

      expect(dispatch.calledOnce).to.be.true;
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-community-care-vista-path-started',
      });
    });

    it('should record community-care event with cerner ehr', async () => {
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: { ehr: null },
      });

      const thunk = startRequestAppointmentFlow(
        true,
        APPOINTMENT_SYSTEM.cerner,
      );
      await thunk(dispatch, getState);

      expect(dispatch.calledOnce).to.be.true;
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-community-care-cerner-path-started',
      });
    });

    it('should fall back to state ehr when no ehr param is passed', async () => {
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: { ehr: APPOINTMENT_SYSTEM.cerner },
      });

      const thunk = startRequestAppointmentFlow(false);
      await thunk(dispatch, getState);

      expect(dispatch.calledOnce).to.be.true;
      expect(global.window.dataLayer[0]).to.deep.include({
        event: 'vaos-request-cerner-path-started',
      });
    });
  });
});
