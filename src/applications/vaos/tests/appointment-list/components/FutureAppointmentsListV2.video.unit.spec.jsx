import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
import { getVAFacilityMock, getVideoAppointmentMock } from '../../mocks/v0';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import { waitFor } from '@testing-library/dom';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { AppointmentList } from '../../../appointment-list';
import sinon from 'sinon';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

// VA appointment id from confirmed_va.json
const url = 'va/05760f00c80ae60ce49879cf37a05fc8';

describe('<ConfirmedAppointmentDetailsPage>', () => {
  describe('video appointments', () => {
    beforeEach(() => {
      mockFetch();
      const sameDayDate = moment(getTimezoneTestDate())
        .add(330, 'minutes')
        .format('YYYY-MM-DD[T]HH:mm:ss');
      MockDate.set(sameDayDate);
    });
    afterEach(() => {
      resetFetch();
      MockDate.reset();
    });
    it('should show info and disabled link when ad hoc', async () => {
      const appointment = getVideoAppointmentMock();
      const startDate = moment.utc().add(3, 'days');
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        bookingNotes: 'Some random note',
        appointmentKind: 'ADHOC',
        status: { description: 'F', code: 'FUTURE' },
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
            contactInformation: {
              mobile: '8888888888',
              preferredEmail: 'marcy.nadeau@va.gov',
              timeZone: '10',
            },
            location: {
              type: 'VA',
              facility: {
                name: 'CHEYENNE VAMC',
                siteCode: '983',
                timeZone: '10',
              },
            },
            virtualMeetingRoom: {
              conference: 'VVC8275247',
              pin: '7172705#',
              url:
                'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
            },
          },
        ],
      };

      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      expect(screen.getByRole('link', { name: /VA online scheduling/ })).to.be
        .ok;

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.baseElement).to.contain.text('VA Video Connect at home');

      expect(screen.baseElement).to.contain.text(
        'You can join this meeting from your home or anywhere you have a secure Internet connnection.',
      );
      expect(screen.baseElement).to.contain.text(
        'You can join VA Video Connect up to 30 minutes prior to the start time.',
      );

      expect(screen.getByText(/join appointment/i)).to.have.attribute(
        'aria-disabled',
        'true',
      );

      expect(screen.baseElement).to.contain.text('You’ll be meeting with');
      expect(screen.baseElement).to.contain.text('Test T+90 Test');

      expect(
        screen.getByRole('link', {
          name: new RegExp(
            startDate.format(
              '[Add] MMMM D, YYYY [appointment to your calendar]',
            ),
            'i',
          ),
        }),
      ).to.be.ok;
      expect(screen.getByText(/Print/)).to.be.ok;
      expect(screen.baseElement).to.not.contain.text('Reschedule');

      expect(screen.baseElement).to.contain.text('Prepare for video visit');

      expect(screen.baseElement).to.contain.text(
        'Contact this facility if you need to reschedule or cancel your appointment.',
      );

      expect(
        screen.getByRole('button', {
          name: /Go back to appointments/,
        }),
      ).to.be.ok;
    });

    it('should show active link if 30 minutes in the future', async () => {
      const appointment = getVideoAppointmentMock();
      const startDate = moment.utc().add(30, 'minutes');
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        bookingNotes: 'Some random note',
        appointmentKind: 'ADHOC',
        status: { description: 'F', code: 'FUTURE' },
        patients: [
          {
            virtualMeetingRoom: {
              url: 'http://videourl.va.gov',
            },
          },
        ],
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
            contactInformation: {
              mobile: '8888888888',
              preferredEmail: 'marcy.nadeau@va.gov',
              timeZone: '10',
            },
            location: {
              type: 'VA',
              facility: {
                name: 'CHEYENNE VAMC',
                siteCode: '983',
                timeZone: '10',
              },
            },
            virtualMeetingRoom: {
              conference: 'VVC8275247',
              pin: '7172705#',
              url:
                'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
            },
          },
        ],
      };
      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;

      expect(screen.getByText(/join appointment/i)).to.have.attribute(
        'aria-disabled',
        'false',
      );

      expect(screen.getByText(/join appointment/i)).to.have.attribute(
        'href',
        'http://videourl.va.gov',
      );
    });

    it('should show active link less than 30 minutes in the future', async () => {
      const startDate = moment.utc().add(20, 'minutes');
      const appointment = getVideoAppointmentMock();
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        appointmentKind: 'ADHOC',
        status: { description: 'F', code: 'FUTURE' },
        patients: [
          {
            virtualMeetingRoom: {
              url: 'http://videourl.va.gov',
            },
          },
        ],
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
            contactInformation: {
              mobile: '8888888888',
              preferredEmail: 'marcy.nadeau@va.gov',
              timeZone: '10',
            },
            location: {
              type: 'VA',
              facility: {
                name: 'CHEYENNE VAMC',
                siteCode: '983',
                timeZone: '10',
              },
            },
            virtualMeetingRoom: {
              conference: 'VVC8275247',
              pin: '7172705#',
              url:
                'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
            },
          },
        ],
      };
      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;

      expect(screen.getByText(/join appointment/i)).to.have.attribute(
        'aria-disabled',
        'false',
      );

      expect(screen.getByText(/join appointment/i)).to.have.attribute(
        'href',
        'http://videourl.va.gov',
      );
    });

    it('should show active link if less than 4 hours in the past', async () => {
      const startDate = moment().add(-239, 'minutes');
      const appointment = getVideoAppointmentMock();
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        bookingNotes: 'Some random note',
        appointmentKind: 'ADHOC',
        status: { description: 'F', code: 'FUTURE' },
        patients: [
          {
            virtualMeetingRoom: {
              url: 'http://videourl.va.gov',
            },
          },
        ],
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
            contactInformation: {
              mobile: '8888888888',
              preferredEmail: 'marcy.nadeau@va.gov',
              timeZone: '10',
            },
            location: {
              type: 'VA',
              facility: {
                name: 'CHEYENNE VAMC',
                siteCode: '983',
                timeZone: '10',
              },
            },
            virtualMeetingRoom: {
              conference: 'VVC8275247',
              pin: '7172705#',
              url:
                'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
            },
          },
        ],
      };
      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;

      expect(screen.getByText(/join appointment/i)).to.have.attribute(
        'aria-disabled',
        'false',
      );

      expect(screen.getByText(/join appointment/i)).to.have.attribute(
        'href',
        'http://videourl.va.gov',
      );
    });

    it('should show message about when to join if mobile gfe', async () => {
      const startDate = moment().add(30, 'minutes');
      const appointment = getVideoAppointmentMock();
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        appointmentKind: 'MOBILE_GFE',
        status: { description: 'F', code: 'FUTURE' },
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
            contactInformation: {
              mobile: '8888888888',
              preferredEmail: 'marcy.nadeau@va.gov',
              timeZone: '10',
            },
            location: {
              type: 'VA',
              facility: {
                name: 'CHEYENNE VAMC',
                siteCode: '983',
                timeZone: '10',
              },
            },
            virtualMeetingRoom: {
              conference: 'VVC8275247',
              pin: '7172705#',
              url:
                'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
            },
          },
        ],
      };
      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;

      expect(screen.baseElement).to.contain.text(
        'VA Video Connect using VA device',
      );
      expect(screen.baseElement).to.contain.text(
        'You can join this video meeting using a device provided by VA.',
      );

      expect(screen.queryByText(/join appointment/i)).not.to.exist;

      expect(screen.baseElement).to.contain.text('You’ll be meeting with');
      expect(screen.baseElement).to.contain.text('Test T+90 Test');

      expect(screen.baseElement).to.contain.text(
        'Contact this facility if you need to reschedule or cancel your appointment.',
      );
    });

    it('should show address info for clinic based appointment', async () => {
      const appointment = getVideoAppointmentMock();
      const startDate = moment.utc().add(3, 'days');
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: '123',
        sta6aid: '983',
        startDate: startDate.format(),
        clinicFriendlyName: 'CHY PC VAR2',
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        bookingNotes: 'Some random note',
        appointmentKind: 'CLINIC_BASED',
        status: { description: 'F', code: 'FUTURE' },
        providers: [
          {
            clinic: {
              ien: '455',
              name: 'Testing',
            },
          },
        ],
      };
      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const facility = {
        id: 'vha_442',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '442',
          name: 'Cheyenne VA Medical Center',
          address: {
            physical: {
              zip: '82001-5356',
              city: 'Cheyenne',
              state: 'WY',
              address1: '2360 East Pershing Boulevard',
            },
          },
          phone: {
            main: '307-778-7550',
          },
        },
      };
      mockFacilitiesFetch('vha_442', [facility]);

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;
      expect(screen.baseElement).to.contain.text(
        'VA Video Connect at VA location',
      );
      expect(screen.baseElement).to.contain.text(
        'You must join this video meeting from the VA location listed below.',
      );
      expect(screen.queryByText(/join appointment/i)).to.not.exist;
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
      expect(screen.baseElement).to.contain.text(
        '2360 East Pershing Boulevard',
      );
      expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
      expect(screen.getByRole('link', { name: /Directions/ })).to.be.ok;

      expect(screen.baseElement).to.contain.text('Clinic: CHY PC VAR2');
      expect(screen.baseElement).to.contain.text('Main phone: 307-778-7550');
      expect(screen.getAllByRole('link', { name: /3 0 7. 7 7 8. 7 5 5 0./ })).to
        .be.ok;
    });

    it('should fire a print request when print button clicked', async () => {
      const startDate = moment.utc().add(20, 'minutes');
      const appointment = getVideoAppointmentMock();
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        appointmentKind: 'ADHOC',
        status: { description: 'F', code: 'FUTURE' },
        patients: [
          {
            virtualMeetingRoom: {
              url: 'http://videourl.va.gov',
            },
          },
        ],
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
            contactInformation: {
              mobile: '8888888888',
              preferredEmail: 'marcy.nadeau@va.gov',
              timeZone: '10',
            },
            location: {
              type: 'VA',
              facility: {
                name: 'CHEYENNE VAMC',
                siteCode: '983',
                timeZone: '10',
              },
            },
            virtualMeetingRoom: {
              conference: 'VVC8275247',
              pin: '7172705#',
              url:
                'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
            },
          },
        ],
      };
      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      const oldPrint = global.window.print;
      const printSpy = sinon.spy();
      global.window.print = printSpy;

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      expect(screen.getByRole('link', { name: /VA online scheduling/ })).to.be
        .ok;

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(printSpy.notCalled).to.be.true;
      fireEvent.click(await screen.findByText(/Print/i));
      expect(printSpy.calledOnce).to.be.true;
      global.window.print = oldPrint;
    });

    it('ATLAS appointment should display title', async () => {
      const appointment = getVideoAppointmentMock();
      const startDate = moment.utc().add(3, 'days');
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        bookingNotes: 'Some random note',
        appointmentKind: 'ADHOC',
        status: { description: 'F', code: 'FUTURE' },
        providers: [
          {
            name: {
              firstName: 'Meg',
              lastName: 'Smith',
            },
          },
        ],
        tasInfo: {
          siteCode: '9931',
          slotId: 'Slot8',
          confirmationCode: '7VBBCA',
          address: {
            streetAddress: '114 Dewey Ave',
            city: 'Eureka',
            state: 'MT',
            zipCode: '59917',
            country: 'USA',
            longitude: null,
            latitude: null,
            additionalDetails: '',
          },
          contacts: [
            {
              name: 'Decker Konya',
              phone: '5557582786',
              email: 'Decker.Konya@va.gov',
            },
          ],
        },
      };

      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.getByRole('link', { name: /VA online scheduling/ })).to.be
        .ok;

      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;

      expect(screen.baseElement).to.contain.text(
        'VA Video Connect at an ATLAS location',
      );

      expect(screen.baseElement).to.contain.text(
        'You must join this video meeting from the ATLAS (non-VA) location listed below.',
      );
      expect(screen.baseElement).to.contain.text('114 Dewey Ave');
      expect(screen.baseElement).to.contain.text('Eureka, MT 59917');
      expect(screen.getByRole('link', { name: /Directions/ })).to.be.ok;

      expect(screen.findByText(/Appointment Code: 7VBBCA/i)).to.be.ok;
      expect(
        screen.findByText(
          /You will use this code to find your appointment using the computer provided at the site./i,
        ),
      ).to.be.ok;

      expect(
        screen.getByRole('link', {
          name: new RegExp(
            startDate.format(
              '[Add] MMMM D, YYYY [appointment to your calendar]',
            ),
            'i',
          ),
        }),
      ).to.be.ok;
      expect(screen.getByText(/Print/)).to.be.ok;

      expect(
        screen.findByText(
          /contact this facility if you need to reschedule or cancel your appointment\./i,
        ),
      ).to.be.ok;
    });
  });
  describe('video appointments (css transition check)', () => {
    it('should reveal video visit instructions', async () => {
      const startDate = moment.utc().add(30, 'minutes');
      const appointment = getVideoAppointmentMock();
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: null,
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        bookingNotes: 'Some random note',
        appointmentKind: 'ADHOC',
        status: { description: 'F', code: 'FUTURE' },
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
            contactInformation: {
              mobile: '8888888888',
              preferredEmail: 'marcy.nadeau@va.gov',
              timeZone: '10',
            },
            location: {
              type: 'VA',
              facility: {
                name: 'CHEYENNE VAMC',
                siteCode: '983',
                timeZone: '10',
              },
            },
            virtualMeetingRoom: {
              conference: 'VVC8275247',
              pin: '7172705#',
              url:
                'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
            },
          },
        ],
      };
      mockAppointmentInfo({
        va: [appointment],
        cc: [],
        requests: [],
        isHomepageRefresh: true,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
        },
      );

      fireEvent.click(await screen.findByText(/Details/));

      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0]).to.equal(url),
      );

      await screen.findByText(
        new RegExp(
          startDate
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      );

      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;
      expect(screen.queryByText(/before your appointment/i)).to.not.exist;

      fireEvent.click(screen.getByText(/Prepare for video visit/i));

      expect(await screen.findByText('Before your appointment:')).to.be.ok;
    });
  });
});
