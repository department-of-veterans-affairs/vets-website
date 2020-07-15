import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { getVARequestMock, getVAFacilityMock } from '../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../mocks/helpers';

import reducers from '../../reducers';
import FutureAppointmentsList from '../../components/FutureAppointmentsList';
import ExpressCareList from '../../components/ExpressCareList';

describe('VAOS integration: express care requests', () => {
  describe('when shown in upcoming appointments tab', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCancel: true,
      },
    };

    it('should show appropriate information for a submitted request', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        purposeOfVisit: 'New Issue',
        bestTimetoCall: ['Morning'],
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        typeOfCareId: 'CR1',
        reasonForVisit: 'Back pain',
        friendlyLocationName: 'Some VA medical center',
        appointmentType: 'Express Care',
        facility: {
          ...appointment.attributes.facility,
          facilityCode: '983GC',
        },
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const { baseElement, findByText, getByText } = renderInReduxProvider(
        <FutureAppointmentsList />,
        {
          initialState,
          reducers,
        },
      );

      await findByText(/Some VA medical center/i);
      expect(baseElement).to.contain.text('Express care appointment');
      expect(baseElement).not.to.contain.text('Preferred date and time');
      expect(baseElement).not.to.contain.text('in the morning');
      expect(baseElement).not.to.contain.text('Back pain');
      expect(getByText(/cancel appointment/i)).to.have.tagName('button');

      fireEvent.click(getByText('Show more'));
      await findByText(/Reason for appointment/i);

      expect(baseElement).to.contain.text('Call morning');
      expect(baseElement).to.contain.text('Back pain');
      expect(baseElement).to.contain.text('Your contact details');
      expect(baseElement).to.contain.text('patient.test@va.gov');
      expect(baseElement).to.contain.text('5555555566');
    });

    it('should show appropriate information for an escalated request', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Escalated to Tele/Urgent Care - Phone',
        typeOfCareId: 'CR1',
        reasonForVisit: 'Back pain',
        friendlyLocationName: 'Some VA medical center',
        facility: {
          ...appointment.attributes.facility,
          facilityCode: '983GC',
        },
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const {
        baseElement,
        findByText,
        getByText,
        queryByText,
      } = renderInReduxProvider(<FutureAppointmentsList />, {
        initialState,
        reducers,
      });

      await findByText(/Some VA medical center/i);
      expect(baseElement).not.to.contain.text('Back pain');
      expect(queryByText(/cancel appointment/i)).to.not.be.ok;

      fireEvent.click(getByText('Show more'));
      await findByText(/Reason for appointment/i);

      expect(baseElement).to.contain.text('Back pain');
    });
  });
  describe('when shown in separate tab', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCancel: true,
        vaOnlineSchedulingExpressCare: true,
      },
    };

    it('should show appropriate information for a submitted request', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        typeOfCareId: 'CR1',
        status: 'Submitted',
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        reasonForVisit: 'Back pain',
        additionalInformation: 'Need help ASAP',
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const { baseElement, findByText, getByText } = renderInReduxProvider(
        <ExpressCareList />,
        {
          initialState,
          reducers,
        },
      );

      await findByText(/Back pain/i);
      expect(baseElement).to.contain.text('Next step');
      expect(baseElement).to.contain('.fa-exclamation-triangle');
      expect(baseElement).to.contain('.vads-u-border-color--warning-message');
      expect(getByText(/cancel appointment/i)).to.have.tagName('button');

      expect(baseElement).to.contain.text('Your contact details');
      expect(baseElement).to.contain.text('5555555566');
      expect(baseElement).to.contain.text('patient.test@va.gov');

      expect(baseElement).to.contain.text(
        'You shared these details about your concern',
      );
      expect(baseElement).to.contain.text('Need help ASAP');
    });

    it('should show appropriate information for an escalated request', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        typeOfCareId: 'CR1',
        status: 'Escalated to Tele/Urgent Care - Phone',
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        reasonForVisit: 'Back pain',
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const { baseElement, findByText, queryByText } = renderInReduxProvider(
        <ExpressCareList />,
        {
          initialState,
          reducers,
        },
      );

      await findByText(/Back pain/i);
      expect(baseElement).to.contain.text('Next step');
      expect(baseElement).to.contain('.fa-exclamation-triangle');
      expect(baseElement).to.contain('.vads-u-border-color--warning-message');
      expect(queryByText(/cancel appointment/i)).to.not.be.ok;
    });

    it('should show appropriate information for a cancelled request', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        typeOfCareId: 'CR1',
        status: 'Cancelled',
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        reasonForVisit: 'Back pain',
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const {
        baseElement,
        findByText,
        queryByText,
        getByText,
      } = renderInReduxProvider(<ExpressCareList />, {
        initialState,
        reducers,
      });

      await findByText(/Back pain/i);
      expect(getByText('Canceled')).to.be.ok;
      expect(baseElement).to.contain('.fa-exclamation-circle');
      expect(baseElement).to.contain('.vads-u-border-color--secondary-dark');
      expect(queryByText(/cancel appointment/i)).to.not.be.ok;
    });

    it('should show text when unable to reach veteran', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        typeOfCareId: 'CR1',
        status: 'Cancelled',
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        reasonForVisit: 'Back pain',
        appointmentRequestDetailCode: [{ detailCode: { code: 'DETCODE23' } }],
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const {
        baseElement,
        findByText,
        queryByText,
        getByText,
      } = renderInReduxProvider(<ExpressCareList />, {
        initialState,
        reducers,
      });

      await findByText(/Back pain/i);
      expect(getByText('Canceled – Could not reach Veteran')).to.be.ok;
      expect(baseElement).to.contain('.fa-exclamation-circle');
      expect(baseElement).to.contain('.vads-u-border-color--secondary-dark');
      expect(queryByText(/cancel appointment/i)).to.not.be.ok;
    });

    it('should show appropriate status when request is resolved', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        typeOfCareId: 'CR1',
        status: 'Resolved',
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        reasonForVisit: 'Back pain',
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const {
        baseElement,
        findByText,
        queryByText,
        getByText,
      } = renderInReduxProvider(<ExpressCareList />, {
        initialState,
        reducers,
      });

      await findByText(/Back pain/i);
      expect(getByText('Complete')).to.be.ok;
      expect(baseElement).to.contain('.vads-u-border-color--green');
      expect(baseElement).to.contain('.fa-check-circle');
      expect(queryByText(/cancel appointment/i)).to.not.be.ok;
    });

    it('should not show up in upcoming tab', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        typeOfCareId: 'CR1',
        reasonForVisit: 'Back pain',
        appointmentType: 'Express Care',
        facility: {
          ...appointment.attributes.facility,
          facilityCode: '983GC',
        },
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });

      const { findByText } = renderInReduxProvider(<FutureAppointmentsList />, {
        initialState,
        reducers,
      });

      return expect(findByText(/You don’t have any appointments/i)).to
        .eventually.be.ok;
    });
  });
});
