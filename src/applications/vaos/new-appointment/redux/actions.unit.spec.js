import { expect } from 'chai';
import sinon from 'sinon';

import {
  routeToPageInFlow,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
} from './actions';

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
});
