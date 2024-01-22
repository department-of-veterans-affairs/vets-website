import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import CheckInConfirmation from '../CheckInConfirmation';

import * as useSendTravelPayClaimModule from '../../../../hooks/useSendTravelPayClaim';
import * as useStorageModule from '../../../../hooks/useStorage';

import * as useGetCheckInDataModule from '../../../../hooks/useGetCheckInData';
import * as useUpdateErrorModule from '../../../../hooks/useUpdateError';
import * as useFormRoutingModule from '../../../../hooks/useFormRouting';

describe('check in', () => {
  describe('CheckInConfirmation', () => {
    const appointments = [
      {
        clinicPhone: '555-867-5309',
        startTime: '2021-07-19T13:56:31',
        facilityName: 'Acme VA',
        clinicName: 'Green Team Clinic1',
        stationNo: '1234',
      },
    ];
    const multipleAppointments = [
      {
        clinicPhone: '555-867-5309',
        startTime: '2021-07-19T13:56:31',
        facilityName: 'Acme VA',
        clinicName: 'Green Team Clinic1',
        stationNo: '1234',
      },
      {
        clinicPhone: '555-867-5309',
        startTime: '2021-07-19T13:56:31',
        facilityName: 'Acme VA',
        clinicName: 'Green Team Clinic1',
        stationNo: '1234',
      },
    ];
    it('renders an appointment list', () => {
      const component = render(
        <CheckInProvider>
          <CheckInConfirmation
            appointments={appointments}
            selectedAppointment={appointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('multiple-appointments-confirm')).to.exist;
    });
    it('should call setTravelPayClaimSet', () => {
      const sandbox = sinon.createSandbox();
      const setSpy = sinon.spy();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      sandbox.stub(useStorageModule, 'useStorage').returns({
        setTravelPaySent: setSpy,
        getTravelPaySent: () => [],
        setShouldSendTravelPayClaim: () => {},
      });
      sandbox
        .stub(useSendTravelPayClaimModule, 'useSendTravelPayClaim')
        .returns({
          travelPayClaimSent: true,
        });
      const component = render(
        <CheckInProvider>
          <CheckInConfirmation
            appointments={appointments}
            selectedAppointment={appointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('multiple-appointments-confirm')).to.exist;
      expect(setSpy.calledOnce).to.be.true;
      sandbox.restore();
    });
    it('should call refreshCheckInData if details is clicked', () => {
      const sandbox = sinon.createSandbox();
      const refreshCheckInDataSpy = sinon.spy();
      sandbox.stub(useGetCheckInDataModule, 'useGetCheckInData').returns({
        refreshCheckInData: refreshCheckInDataSpy,
      });
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      const component = render(
        <CheckInProvider>
          <CheckInConfirmation
            appointments={appointments}
            selectedAppointment={appointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      component.getByTestId('details-link').click();
      expect(refreshCheckInDataSpy.calledOnce).to.be.true;
      sandbox.restore();
    });
    it('should call update error if there is an error getting check in data', () => {
      const sandbox = sinon.createSandbox();
      const updateErrorSpy = sinon.spy();
      sandbox.stub(useGetCheckInDataModule, 'useGetCheckInData').returns({
        checkInDataError: true,
      });
      sandbox.stub(useUpdateErrorModule, 'useUpdateError').returns({
        updateError: updateErrorSpy,
      });
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      const component = render(
        <CheckInProvider>
          <CheckInConfirmation
            appointments={appointments}
            selectedAppointment={appointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('multiple-appointments-confirm')).to.exist;
      expect(updateErrorSpy.calledOnce).to.be.true;
      sandbox.restore();
    });
    it('should call jump to page if check in is complete', () => {
      const sandbox = sinon.createSandbox();
      const jumpToPageSpy = sinon.spy();
      sandbox.stub(useGetCheckInDataModule, 'useGetCheckInData').returns({
        isComplete: true,
      });
      sandbox.stub(useFormRoutingModule, 'useFormRouting').returns({
        jumpToPage: jumpToPageSpy,
        getCurrentPageFromRouter: () => {},
      });
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      const component = render(
        <CheckInProvider>
          <CheckInConfirmation
            appointments={appointments}
            selectedAppointment={appointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('multiple-appointments-confirm')).to.exist;
      expect(jumpToPageSpy.calledOnce).to.be.true;
      sandbox.restore();
    });
    it('should render loading component', () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(useGetCheckInDataModule, 'useGetCheckInData').returns({
        isLoading: true,
      });
      const component = render(
        <CheckInProvider>
          <CheckInConfirmation
            appointments={appointments}
            selectedAppointment={appointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('loading-indicator')).to.exist;
      sandbox.restore();
    });
    it('should render back to appointments link if appointments are greater than 1', () => {
      const component = render(
        <CheckInProvider>
          <CheckInConfirmation
            appointments={multipleAppointments}
            selectedAppointment={multipleAppointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('go-to-appointments-button')).to.exist;
    });
    it('should render a travel pay message if travel is enabled', () => {
      const component = render(
        <CheckInProvider
          store={{
            features: {
              /* eslint-disable-next-line camelcase */
              check_in_experience_travel_reimbursement: true,
            },
          }}
        >
          <CheckInConfirmation
            appointments={multipleAppointments}
            selectedAppointment={multipleAppointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-reimbursement-heading')).to.exist;
    });
    it('should render a travel pay message if travel is enabled', () => {
      const component = render(
        <CheckInProvider
          store={{
            features: {
              /* eslint-disable-next-line camelcase */
              check_in_experience_travel_reimbursement: true,
            },
          }}
        >
          <CheckInConfirmation
            appointments={multipleAppointments}
            selectedAppointment={multipleAppointments[0]}
            triggerRefresh={() => {}}
            router={{}}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-reimbursement-heading')).to.exist;
    });
  });
});
