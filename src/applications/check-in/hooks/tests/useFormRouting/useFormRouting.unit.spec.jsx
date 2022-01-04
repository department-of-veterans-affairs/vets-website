import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import { render, fireEvent } from '@testing-library/react';

import TestComponent from './TestComponent';
import { GO_TO_NEXT_PAGE } from '../../../actions/navigation';

const URLS = Object.freeze({
  CONFIRMATION: 'complete',
  DEMOGRAPHICS: 'contact-information',
  EMERGENCY_CONTACT: 'emergency-contact',
  ERROR: 'error',
  INTRODUCTION: 'introduction',
  LANDING: '',
  NEXT_OF_KIN: 'next-of-kin',
  SEE_STAFF: 'see-staff',
  VERIFY: 'verify',
});

describe('check-in', () => {
  describe('useFormRouting', () => {
    describe('should pull data from redux store', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            form: {
              pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
              currentPage: 'first-page',
            },
          },
        };
        store = mockStore(initState);
      });

      it('should get the current pages from redux', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent router={{ push: () => {} }} />
          </Provider>,
        );

        expect(component.queryByTestId('current-page').textContent).to.equal(
          'first-page',
        );
        expect(component.queryByTestId('all-pages').textContent).to.equal(
          'first-page,second-page,third-page,fourth-page',
        );
      });
    });
    describe('goToNextPage', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            form: {
              pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
              currentPage: 'first-page',
            },
          },
        };
        store = mockStore(initState);
      });
      it('should go to the next page', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={{
                push,
              }}
            />
          </Provider>,
        );

        const button = component.getByTestId('next-button');
        fireEvent.click(button);

        expect(push.calledWith('second-page')).to.be.true;
        const routingAction = store
          .getActions()
          .find(action => action.type === GO_TO_NEXT_PAGE);
        expect(routingAction.payload.nextPage).to.equal('second-page');
      });
    });
    describe('goToNextPage', () => {
      let store;

      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            form: {
              pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
              currentPage: 'fourth-page',
            },
          },
        };
        store = mockStore(initState);
      });
      it('should go to the next page - should redirect to error at the end of the array', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={{
                push,
              }}
            />
          </Provider>,
        );

        const button = component.getByTestId('next-button');
        fireEvent.click(button);

        expect(push.calledWith(URLS.ERROR)).to.be.true;
        const routingAction = store
          .getActions()
          .find(action => action.type === GO_TO_NEXT_PAGE);
        expect(routingAction.payload.nextPage).to.equal(URLS.ERROR);
      });
    });
    describe('goToPreviousPage', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            form: {
              pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
              currentPage: 'third-page',
            },
          },
        };
        store = mockStore(initState);
      });
      it('should go to the prev page', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={{
                push,
              }}
            />
          </Provider>,
        );

        const button = component.getByTestId('prev-button');
        fireEvent.click(button);
        expect(push.calledWith('second-page')).to.be.true;
        const routingAction = store
          .getActions()
          .find(action => action.type === GO_TO_NEXT_PAGE);
        expect(routingAction.payload.nextPage).to.equal('second-page');
      });
    });
    describe('goToPreviousPage', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            form: {
              pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
              currentPage: 'first-page',
            },
          },
        };
        store = mockStore(initState);
      });
      it('should go to the prev page - should redirect to error at the end of the array', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={{
                push,
              }}
            />
          </Provider>,
        );

        const button = component.getByTestId('prev-button');
        fireEvent.click(button);
        expect(push.calledWith(URLS.ERROR)).to.be.true;
        const routingAction = store
          .getActions()
          .find(action => action.type === GO_TO_NEXT_PAGE);
        expect(routingAction.payload.nextPage).to.equal(URLS.ERROR);
      });
    });
    describe('goToErrorPage', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            form: {
              pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
              currentPage: 'first-page',
            },
          },
        };
        store = mockStore(initState);
      });
      it('should go to the error page - should redirect to error', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={{
                push,
              }}
            />
          </Provider>,
        );

        const button = component.getByTestId('error-button');
        fireEvent.click(button);
        expect(push.calledWith(URLS.ERROR)).to.be.true;
        const routingAction = store
          .getActions()
          .find(action => action.type === GO_TO_NEXT_PAGE);
        expect(routingAction.payload.nextPage).to.equal(URLS.ERROR);
      });
    });
    describe('jumpToPage', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            form: {
              pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
              currentPage: 'first-page',
            },
          },
        };
        store = mockStore(initState);
      });
      it('set current page to jumped value', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={{
                push,
              }}
            />
          </Provider>,
        );

        const button = component.getByTestId('jump-button');
        fireEvent.click(button);
        expect(push.calledWith({ pathname: URLS.INTRODUCTION })).to.be.true;
        const routingAction = store
          .getActions()
          .find(action => action.type === GO_TO_NEXT_PAGE);
        expect(routingAction.payload.nextPage).to.equal(URLS.INTRODUCTION);
      });
      it('accept urls params', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={{
                push,
              }}
            />
          </Provider>,
        );

        const button = component.getByTestId('jump-with-params-button');
        fireEvent.click(button);
        expect(
          push.calledWith({
            pathname: URLS.INTRODUCTION,
            search: '?id=1234&query=some-query',
          }),
        ).to.be.true;
        const routingAction = store
          .getActions()
          .find(action => action.type === GO_TO_NEXT_PAGE);
        expect(routingAction.payload.nextPage).to.equal(URLS.INTRODUCTION);
      });
    });
  });
});
