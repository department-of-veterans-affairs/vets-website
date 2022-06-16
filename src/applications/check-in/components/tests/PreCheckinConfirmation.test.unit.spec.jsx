import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { shallow } from 'enzyme';

import {
  singleAppointment,
  multipleAppointments,
} from '../../tests/unit/mocks/mock-appointments';

import PreCheckinConfirmation from '../PreCheckinConfirmation';

describe('pre-check-in', () => {
  let store;
  beforeEach(() => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      checkInData: {
        context: {
          token: '',
        },
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
      },
    };
    store = mockStore(initState);
  });

  const formData = {
    demographicsUpToDate: 'yes',
    emergencyContactUpToDate: 'yes',
    nextOfKinUpToDate: 'yes',
  };

  describe('Confirmation page', () => {
    describe('appointment without friendly name', () => {
      const appointments = singleAppointment;
      it('renders loading screen', () => {
        const wrapper = shallow(
          <PreCheckinConfirmation
            appointments={appointments}
            formData={formData}
            isLoading
          />,
        );
        expect(wrapper.find('va-loading-indicator').length).to.equal(1);
        wrapper.unmount();
      });
      it('renders page with clinic name', () => {
        const screen = render(
          <Provider store={store}>
            <PreCheckinConfirmation
              appointments={appointments}
              formData={formData}
              isLoading={false}
            />
          </Provider>,
        );
        expect(screen.getAllByText('LOM ACC CLINIC TEST')).to.have.lengthOf(1);
      });
    });
    describe('appointments with friendly name', () => {
      const appointments = multipleAppointments;
      it('renders page - no updates', () => {
        const screen = render(
          <Provider store={store}>
            <PreCheckinConfirmation
              appointments={appointments}
              formData={formData}
              isLoading={false}
            />
            ,
          </Provider>,
        );
        expect(screen.getByTestId('confirmation-wrapper')).to.exist;
        expect(screen.getByTestId('confirmation-update-alert')).to.have.text(
          'Please bring your insurance cards with you to your appointment.',
        );
      });
      it('renders page with clinic friendly name', () => {
        const screen = render(
          <Provider store={store}>
            <PreCheckinConfirmation
              appointments={appointments}
              formData={formData}
              isLoading={false}
            />
          </Provider>,
        );
        expect(screen.getAllByText('TEST CLINIC')).to.have.lengthOf(3);
      });
      it('page passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <PreCheckinConfirmation
              appointments={appointments}
              formData={formData}
              isLoading={false}
            />
          </Provider>,
        );
      });
    });
  });
});
