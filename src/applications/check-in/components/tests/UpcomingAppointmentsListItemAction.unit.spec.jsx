import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import UpcomingAppointmentsListItemAction from '../UpcomingAppointmentsListItemAction';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import { URLS } from '../../utils/navigation';

const eligibleAppointment = {
  facility: 'LOMA LINDA VA CLINIC',
  clinicPhoneNumber: '5551234567',
  clinicFriendlyName: 'TEST CLINIC',
  clinicName: 'LOM ACC CLINIC TEST',
  appointmentIen: '0000',
  stationNo: '0000',
  startTime: '2021-11-16T21:39:36',
  doctorName: 'Dr. Green',
  clinicStopCodeName: 'Primary care',
  kind: 'clinic',
  eligibility: 'ELIGIBLE',
};
const ineligibleAppointment = {
  facility: 'LOMA LINDA VA CLINIC',
  clinicPhoneNumber: '5551234567',
  clinicFriendlyName: 'TEST CLINIC',
  clinicName: 'LOM ACC CLINIC TEST',
  appointmentIen: '0000',
  stationNo: '0000',
  startTime: '2021-11-16T21:39:36',
  doctorName: 'Dr. Green',
  clinicStopCodeName: 'Primary care',
  kind: 'clinic',
  eligibility: 'INELIGIBLE',
};

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('UpcomingAppointmentsListItemAction', () => {
    const push = sinon.spy();
    const mockRouter = {
      push,
      currentPage: '/appointments',
      params: {},
    };
    const mockStore = {
      formPages: [URLS.APPOINTMENTS, URLS.COMPLETE],
    };
    it('should render an action link', () => {
      const screen = render(
        <CheckInProvider router={mockRouter} store={mockStore}>
          <UpcomingAppointmentsListItemAction
            appointment={eligibleAppointment}
          />
        </CheckInProvider>,
      );
      const actionLink = screen.getByTestId('action-link');
      expect(actionLink).to.exist;
      fireEvent.click(actionLink);
      // console.log(push.getCall(0).args);
      expect(push.calledWith({ pathname: 'complete/0000-0000' })).to.be.true;
    });
    it('should not render an action link for ineligible appointments', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItemAction
            appointment={ineligibleAppointment}
          />
        </CheckInProvider>,
      );
      const actionLink = screen.queryByTestId('action-link');
      expect(actionLink).to.not.exist;
    });
  });
});
