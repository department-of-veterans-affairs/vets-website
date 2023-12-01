import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';

import { render } from '@testing-library/react';

import TestComponent from './TestComponent';

describe('check-in', () => {
  describe('useDemographicsFlags', () => {
    describe('should render with token only.', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            context: {
              token: 123,
            },
            form: {
              data: {},
              pages: [],
            },
          },
        };
        store = mockStore(initState);
      });
      it('should render without form data', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent />
          </Provider>,
        );

        expect(component.getByTestId('demographicsUpToDate')).to.have.text(
          'no',
        );
        expect(component.getByTestId('emergencyContactUpToDate')).to.have.text(
          'no',
        );
        expect(component.getByTestId('nextOfKinUpToDate')).to.have.text('no');

        expect(component.getByTestId('demographicsFlagsEmpty')).to.have.text(
          'yes',
        );
      });
    });
    describe('should render with form data.', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            context: {
              token: 123,
            },
            form: {
              data: {
                demographicsUpToDate: 'yes',
                emergencyContactUpToDate: 'no',
                nextOfKinUpToDate: 'yes',
              },
              pages: [],
            },
          },
        };
        store = mockStore(initState);
      });
      it('should render with redux store data', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent />
          </Provider>,
        );
        expect(component.getByTestId('demographicsUpToDate')).to.have.text(
          'yes',
        );
        expect(component.getByTestId('emergencyContactUpToDate')).to.have.text(
          'no',
        );
        expect(component.getByTestId('nextOfKinUpToDate')).to.have.text('yes');
        expect(component.getByTestId('demographicsFlagsEmpty')).to.have.text(
          'no',
        );
      });
    });
  });
});
