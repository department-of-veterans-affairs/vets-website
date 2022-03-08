import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';

import { render, fireEvent } from '@testing-library/react';

import TestComponent from './TestComponent';

describe('check-in', () => {
  describe('useDemographicsFlags', () => {
    describe('should render with default values.', () => {
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
            },
          },
        };
        store = mockStore(initState);
      });
      it('should render test component with all values set to false', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent defaultValue={false} />
          </Provider>,
        );
        const sentFalseButton = component.getByTestId(
          'setDemographicsFlagsSentFalse',
        );
        const sentTrueButton = component.getByTestId(
          'setDemographicsFlagsSentTrue',
        );

        expect(component.getByTestId('demographicsUpToDate')).to.have.text(
          'no',
        );
        expect(component.getByTestId('emergencyContactUpToDate')).to.have.text(
          'no',
        );
        expect(component.getByTestId('nextOfKinUpToDate')).to.have.text('no');
        expect(component.getByTestId('demographicsFlagsSent')).to.have.text(
          'no',
        );
        fireEvent.click(sentTrueButton);
        expect(component.getByTestId('demographicsFlagsSent')).to.have.text(
          'yes',
        );
        fireEvent.click(sentFalseButton);
        expect(component.getByTestId('demographicsFlagsSent')).to.have.text(
          'no',
        );
      });
      it('should render test component with all values set to true', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent defaultValue />
          </Provider>,
        );
        expect(component.getByTestId('demographicsUpToDate')).to.have.text(
          'yes',
        );
        expect(component.getByTestId('emergencyContactUpToDate')).to.have.text(
          'yes',
        );
        expect(component.getByTestId('nextOfKinUpToDate')).to.have.text('yes');
      });
    });
    describe('should render without default values.', () => {
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
      });
    });
  });
});
