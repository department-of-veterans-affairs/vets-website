import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { shallow } from 'enzyme';
import PreCheckinConfirmation from '../PreCheckinConfirmation';

describe.skip('pre-check-in', () => {
  let store;
  describe('Confirmation page', () => {
    describe('appointment without friendly name', () => {
      const appointments = [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: '',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: '2021-11-30T17:12:10.694Z',
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: '2021-11-30T17:12:10.694Z',
          checkInWindowEnd: '2021-11-30T17:12:10.694Z',
          checkedInTime: '',
        },
      ];
      it('renders loading screen', () => {
        const wrapper = shallow(
          <PreCheckinConfirmation
            appointments={appointments}
            hasUpdates={false}
            isLoading
          />,
        );
        expect(wrapper.find('va-loading-indicator').length).to.equal(1);
        wrapper.unmount();
      });
      it('renders page with clinic name', () => {
        const screen = render(
          <PreCheckinConfirmation
            appointments={appointments}
            hasUpdates={false}
            isLoading={false}
          />,
        );
        expect(screen.getAllByText('LOM ACC CLINIC TEST')).to.have.lengthOf(1);
      });
    });
    describe('appointments with friendly name', () => {
      const appointments = [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: '2021-11-30T17:12:10.694Z',
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: '2021-11-30T17:12:10.694Z',
          checkInWindowEnd: '2021-11-30T17:12:10.694Z',
          checkedInTime: '',
        },
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: '2021-11-30T17:12:10.694Z',
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: '2021-11-30T17:12:10.694Z',
          checkInWindowEnd: '2021-11-30T17:12:10.694Z',
          checkedInTime: '',
        },
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-other-ien',
          startTime: '2021-11-30T17:12:10.694Z',
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: '2021-11-30T17:12:10.694Z',
          checkInWindowEnd: '2021-11-30T17:12:10.694Z',
          checkedInTime: '',
        },
      ];
      it('renders page - no updates', () => {
        const screen = render(
          <Provider store={store}>
            <PreCheckinConfirmation
              appointments={appointments}
              hasUpdates={false}
              isLoading={false}
            />
            ,
          </Provider>,
        );
        expect(screen.getByTestId('confirmation-wrapper')).to.exist;
        expect(screen.queryByTestId('confirmation-update-alert')).to.be.null;
      });
      it('renders page with clinic friendly name', () => {
        const screen = render(
          <PreCheckinConfirmation
            appointments={appointments}
            hasUpdates={false}
            isLoading={false}
          />,
        );
        expect(screen.getAllByText('TEST CLINIC')).to.have.lengthOf(3);
      });
      it('page passes axeCheck', () => {
        axeCheck(
          <PreCheckinConfirmation
            appointments={appointments}
            hasUpdates={false}
            isLoading={false}
          />,
        );
      });
    });
  });
});
