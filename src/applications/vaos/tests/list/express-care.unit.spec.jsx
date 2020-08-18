import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import backendServices from 'platform/user/profile/constants/backendServices';
import { getVARequestMock } from '../mocks/v0';
import { mockAppointmentInfo } from '../mocks/helpers';
import { renderFromRoutes } from '../mocks/setup';

describe('VAOS integration: express care requests', () => {
  describe('when shown in upcoming appointments tab', () => {
    const initialState = {
      featureToggles: {
        vaOnlineScheduling: true,
        vaOnlineSchedulingPast: true,
        vaOnlineSchedulingCancel: true,
        vaOnlineSchedulingExpressCare: false,
      },
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          loading: false,
          verified: true,
          services: [backendServices.USER_PROFILE, backendServices.FACILITIES],
          facilities: [{ facilityId: '983', isCerner: false }],
        },
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

      const { baseElement, findByText, getByText } = renderFromRoutes({
        initialState,
      });
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
      } = renderFromRoutes({
        initialState,
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
        vaOnlineScheduling: true,
        vaOnlineSchedulingPast: true,
        vaOnlineSchedulingCancel: true,
        vaOnlineSchedulingExpressCare: true,
      },
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          loading: false,
          verified: true,
          services: [backendServices.USER_PROFILE, backendServices.FACILITIES],
          facilities: [{ facilityId: '983', isCerner: false }],
        },
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
      // We want the EC tab to display even if there's an error fetching appointments
      mockAppointmentInfo({ requests: [appointment], vaError: true });

      const { baseElement, findByText, getByText } = renderFromRoutes({
        initialState,
        path: '/express-care',
      });

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

      expect(
        global.window.dataLayer.find(ev => ev.event === 'nav-tab-click')?.[
          'vaos-express-care-number-of-cards'
        ],
      ).to.equal(1);
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

      const { baseElement, findByText, queryByText } = renderFromRoutes({
        initialState,
        path: '/express-care',
      });

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
      } = renderFromRoutes({
        initialState,
        path: '/express-care',
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
      } = renderFromRoutes({
        initialState,
        path: '/express-care',
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
      } = renderFromRoutes({
        initialState,
        path: '/express-care',
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

      const { findByText, queryByText } = renderFromRoutes({
        initialState,
      });

      expect(await findByText(/You don’t have any appointments/i)).to.be.ok;
      expect(queryByText('Upcoming appointments')).to.not.exist;
    });

    it('should show error message when request fails', async () => {
      mockFetch();
      setFetchJSONFailure(
        global.fetch.withArgs(
          `${
            environment.API_URL
          }/vaos/v0/appointment_requests?start_date=${moment()
            .add(-30, 'days')
            .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
        ),
        { errors: [] },
      );

      const { findByText } = renderFromRoutes({
        initialState,
        path: '/express-care',
      });

      expect(
        await findByText(
          /We’re having trouble getting your Express Care requests/i,
        ),
      ).to.be.ok;
    });

    it('should show message when no requests exist', async () => {
      mockAppointmentInfo({});

      const { findByText } = renderFromRoutes({
        initialState,
        path: '/express-care',
      });

      expect(await findByText(/You don’t have any appointments/i)).to.be.ok;
    });

    it('should sort by date descending', async () => {
      const request = {
        id: 'test',
        attributes: {
          ...getVARequestMock().attributes,
          typeOfCareId: 'CR1',
        },
      };
      const requests = [
        {
          id: '12',
          attributes: {
            ...request.attributes,
            status: 'Resolved',
            reasonForVisit: 'Second',
            date: moment()
              .subtract(1, 'month')
              .format(),
          },
        },
        {
          id: '123',
          attributes: {
            ...request.attributes,
            status: 'Cancelled',
            reasonForVisit: 'Third',
            date: moment()
              .subtract(2, 'month')
              .format(),
          },
        },
        {
          id: '1234',
          attributes: {
            ...request.attributes,
            status: 'Submitted',
            reasonForVisit: 'First',
            date: moment().format(),
          },
        },
      ];
      mockAppointmentInfo({ requests });

      const { baseElement, findByText } = renderFromRoutes({
        initialState,
        path: '/express-care',
      });

      await findByText('First');
      const dateHeadings = Array.from(
        baseElement.querySelectorAll('#appointments-list h3'),
      ).map(card => card.textContent.trim());

      expect(dateHeadings).to.deep.equal(['First', 'Second', 'Third']);
    });
    it('should be cancelled', async () => {
      const appointment = getVARequestMock();
      appointment.id = 'test_id';
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        typeOfCareId: 'CR1',
        reasonForVisit: 'Back pain',
      };
      mockAppointmentInfo({ requests: [appointment] });
      setFetchJSONResponse(
        global.fetch.withArgs(
          `${environment.API_URL}/vaos/v0/appointment_requests/test_id`,
        ),
        {
          data: {
            ...appointment,
            attributes: {
              ...appointment.attributes,
              status: 'Cancelled',
            },
          },
        },
      );

      const {
        getByText,
        findByRole,
        baseElement,
        findByText,
        queryByRole,
      } = renderFromRoutes({
        initialState,
        path: '/express-care',
      });

      await findByText(/cancel appointment/i);
      expect(baseElement).not.to.contain.text('Canceled');

      fireEvent.click(getByText(/cancel appointment/i));

      await findByRole('alertdialog');

      fireEvent.click(getByText(/yes, cancel this appointment/i));

      await findByText(/your appointment has been canceled/i);

      const cancelData = JSON.parse(
        global.fetch
          .getCalls()
          .find(call => call.args[0].includes('appointment_requests/test_id'))
          .args[1].body,
      );

      expect(cancelData).to.deep.equal({
        ...appointment.attributes,
        id: 'test_id',
        appointmentRequestDetailCode: ['DETCODE8'],
        status: 'Cancelled',
      });

      fireEvent.click(getByText(/continue/i));

      expect(queryByRole('alertdialog')).to.not.be.ok;
      expect(baseElement).to.contain.text('Canceled');
    });
  });
});
