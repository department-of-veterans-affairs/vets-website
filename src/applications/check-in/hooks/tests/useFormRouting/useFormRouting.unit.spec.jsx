import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import { render, fireEvent } from '@testing-library/react';

import TestComponent from './TestComponent';

import { createMockRouter } from '../../../tests/unit/mocks/router';

import { URLS } from '../../../utils/navigation';

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
            },
          },
        };
        store = mockStore(initState);
      });

      it('should get the current page from router', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={createMockRouter({
                push: () => {},
                currentPage: 'first-page',
              })}
            />
          </Provider>,
        );

        expect(component.queryByTestId('current-page').textContent).to.equal(
          'first-page',
        );
        expect(component.queryByTestId('all-pages').textContent).to.equal(
          'first-page,second-page,third-page,fourth-page',
        );
      });

      it('should get the previous page from router', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={createMockRouter({
                push: () => {},
                currentPage: 'third-page',
              })}
            />
          </Provider>,
        );

        expect(component.queryByTestId('previous-page').textContent).to.equal(
          'second-page',
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
              router={createMockRouter({
                push,
                currentPage: 'first-page',
              })}
            />
          </Provider>,
        );

        const button = component.getByTestId('next-button');
        fireEvent.click(button);

        expect(push.calledWith('second-page')).to.be.true;
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
              router={createMockRouter({
                push,
                currentPage: 'fourth-page',
              })}
            />
          </Provider>,
        );

        const button = component.getByTestId('next-button');
        fireEvent.click(button);

        expect(push.calledWith(URLS.ERROR)).to.be.true;
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
              router={createMockRouter({
                push,
                currentPage: 'first-page',
              })}
            />
          </Provider>,
        );

        const button = component.getByTestId('error-button');
        fireEvent.click(button);
        expect(push.calledWith(`${URLS.ERROR}?error=test-error`)).to.be.true;
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
              router={createMockRouter({
                push,
                currentPage: 'first-page',
              })}
            />
          </Provider>,
        );

        const button = component.getByTestId('jump-button');
        fireEvent.click(button);
        expect(push.calledWith({ pathname: URLS.INTRODUCTION })).to.be.true;
      });
      it('accept urls params', () => {
        const push = sinon.spy();
        const component = render(
          <Provider store={store}>
            <TestComponent
              router={createMockRouter({
                push,
                currentPage: 'first-page',
              })}
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
      });
    });
  });
});
