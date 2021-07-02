import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import {
  mockAppointmentInfo,
  mockFacilitiesFetch,
  mockFacilityFetch,
  mockSingleAppointmentFetch,
} from '../../../mocks/helpers';
import { getVAFacilityMock, getVideoAppointmentMock } from '../../../mocks/v0';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../../mocks/setup';
import { waitFor } from '@testing-library/dom';
import { mockFetch } from 'platform/testing/unit/helpers';
import { AppointmentList } from '../../../../appointment-list';
import sinon from 'sinon';
import { getICSTokens } from '../../../../utils/calendar';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

// VA appointment id from confirmed_va.json
const url = 'va/05760f00c80ae60ce49879cf37a05fc8';

describe('VAOS <ConfirmedAppointmentDetailsPage>', () => {
  describe('video appointments', () => {
    beforeEach(() => {
      mockFetch();
      const sameDayDate = moment(getTimezoneTestDate())
        .add(330, 'minutes')
        .format('YYYY-MM-DD[T]HH:mm:ss');
      MockDate.set(sameDayDate);
      mockFacilitiesFetch();
      mockFacilityFetch('vha_442', getVAFacilityMock({ id: '442' }));
    });
    afterEach(() => {
      MockDate.reset();
    });
    it('should show info and disabled link if ad hoc and more than 30 minutes in the future', async () => {
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
        instructionsTitle: 'Video Visit Preparation',
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
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
      mockFacilitiesFetch('vha_442', [
        {
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
        },
      ]);

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
        'Contact this facility if you need to reschedule or cancel your appointment',
      );
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
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
      mockFacilityFetch(
        'vha_442',
        getVAFacilityMock({ id: '442', name: 'Cheyenne VA medical center' }),
      );

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
        'Contact this facility if you need to reschedule or cancel your appointment',
      );
      expect(screen.baseElement).to.contain.text('Cheyenne VA medical center');
    });

    it('should direct user to VA facility if we are missing facility details', async () => {
      const appointment = getVideoAppointmentMock();
      const startDate = moment.utc().add(3, 'days');
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: '123',
        sta6aid: null,
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
      mockSingleAppointmentFetch({
        appointment,
      });

      const screen = renderWithStoreAndRouter(
        <AppointmentList featureHomepageRefresh />,
        {
          initialState,
          path: '/va/05760f00c80ae60ce49879cf37a05fc8',
        },
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
        'You must join this video meeting from the VA location where the appointment was scheduled.',
      );
      expect(screen.queryByText(/join appointment/i)).to.not.exist;
    });

    it('should show address info for clinic based appointment', async () => {
      const appointment = getVideoAppointmentMock();
      const startDate = moment.utc().add(3, 'days');
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: '123',
        // This should be different from facilityId to test that correct facility
        // is used
        sta6aid: '983GD',
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
        id: 'vha_442GD',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '442GD',
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
      mockFacilitiesFetch('vha_442GD', [facility]);

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
      expect(screen.baseElement).to.contain.text(
        'Cheyenne, WyomingWY 82001-5356',
      );
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
      expect(screen.baseElement).to.contain.text('Eureka, MontanaMT 59917');
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

    it('should verify Video Connect at home calendar ics file format', async () => {
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
        instructionsTitle: 'Video Visit Preparation',
        providers: [
          {
            name: { firstName: 'Test T+90', lastName: 'Test' },
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
      await screen.findByText(/at home/);

      const ics = decodeURIComponent(
        screen
          .getByRole('link', {
            name: `Add ${startDate.format(
              'MMMM D, YYYY',
            )} appointment to your calendar`,
          })
          .getAttribute('href')
          .replace('data:text/calendar;charset=utf-8,', ''),
      );
      const tokens = getICSTokens(ics);

      expect(tokens.get('BEGIN')).includes('VCALENDAR');
      expect(tokens.get('VERSION')).to.equal('2.0');
      expect(tokens.get('PRODID')).to.equal('VA');
      expect(tokens.get('BEGIN')).includes('VEVENT');
      expect(tokens.has('UID')).to.be.true;
      expect(tokens.get('SUMMARY')).to.contain('VA Video Connect appointment');

      // Description text longer than 74 characters should start on newline beginning
      // with a tab character
      let description = tokens.get('DESCRIPTION');
      description = description.split(/(?=\t)/g); // look ahead include the split character in the results

      expect(description[0]).to.equal(
        'You can join this meeting up to 30 minutes before the start ti',
      );
      expect(description[1]).to.equal('\tme.');
      expect(description[2]).to.equal('\t\\n\\nVA Video Connect at home\\n');
      expect(description[3]).to.equal(
        '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
      );
      expect(description[4]).to.equal(
        '\tintments to get details about this appointment\\n',
      );

      expect(tokens.get('LOCATION')).to.equal('VA Video Connect at home');
      expect(tokens.get('DTSTAMP')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTSTART')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTEND')).to.equal(
        `${startDate
          .clone()
          .add(20, 'minutes') // Default duration
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('END')).includes('VEVENT');
      expect(tokens.get('END')).includes('VCALENDAR');
    });

    it('should verify Video Connect at VA location calendar ics file format', async () => {
      const appointment = getVideoAppointmentMock();
      const startDate = moment.utc().add(3, 'days');
      appointment.attributes = {
        ...appointment.attributes,
        facilityId: '983',
        clinicId: '848',
        clinicFriendlyName: 'CHY PC VAR2',
        sta6aid: '983',
        startDate: startDate.format(),
      };
      appointment.attributes.vvsAppointments[0] = {
        ...appointment.attributes.vvsAppointments[0],
        dateTime: startDate.format(),
        bookingNotes: 'Some random note',
        appointmentKind: 'CLINIC_BASED',
        status: { description: 'F', code: 'FUTURE' },
        providers: [
          {
            name: {
              firstName: 'Meg',
              lastName: 'Smith',
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
      mockFacilityFetch('vha_442', facility);

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
      await screen.findByText(/2360 East Pershing Boulevard/);

      const ics = decodeURIComponent(
        screen
          .getByRole('link', {
            name: `Add ${startDate.format(
              'MMMM D, YYYY',
            )} appointment to your calendar`,
          })
          .getAttribute('href')
          .replace('data:text/calendar;charset=utf-8,', ''),
      );
      const tokens = getICSTokens(ics);

      expect(tokens.get('BEGIN')).includes('VCALENDAR');
      expect(tokens.get('VERSION')).to.equal('2.0');
      expect(tokens.get('PRODID')).to.equal('VA');
      expect(tokens.get('BEGIN')).includes('VEVENT');
      expect(tokens.has('UID')).to.be.true;

      // TODO: location name???
      expect(tokens.get('SUMMARY')).to.equal(
        'VA Video Connect appointment at Cheyenne VA Medical Center',
      );

      // Description text longer than 74 characters should start on newline beginning
      // with a tab character
      let description = tokens.get('DESCRIPTION');
      description = description.split(/(?=\t)/g); // look ahead include the split character in the results
      expect(description[0]).to.equal(
        'You need to join this video meeting from:',
      );
      expect(description[1]).to.equal('\t\\n\\nCheyenne VA Medical Center');
      expect(description[2]).to.equal('\t\\n2360 East Pershing Boulevard\\n');
      expect(description[3]).to.equal('\tCheyenne\\, WY 82001-5356\\n');
      expect(description[4]).to.equal('\t307-778-7550\\n');
      expect(description[5]).to.equal(
        "\t\\nYou'll be meeting with Meg Smith\\n",
      );
      expect(description[6]).to.equal(
        '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
      );
      expect(description[7]).to.equal(
        '\tintments to get details about this appointment\\n',
      );
      expect(tokens.get('LOCATION')).to.equal(
        '2360 East Pershing Boulevard\\, Cheyenne\\, WY 82001-5356',
      );
      expect(tokens.get('DTSTAMP')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTSTART')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTEND')).to.equal(
        `${startDate
          .clone()
          .add(20, 'minutes') // Default duration
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('END')).includes('VEVENT');
      expect(tokens.get('END')).includes('VCALENDAR');
    });

    it('should verify Video Connect at ATLAS calendar ics file format', async () => {
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
      await screen.findByText(/Eureka/);

      const ics = decodeURIComponent(
        screen
          .getByRole('link', {
            name: `Add ${startDate.format(
              'MMMM D, YYYY',
            )} appointment to your calendar`,
          })
          .getAttribute('href')
          .replace('data:text/calendar;charset=utf-8,', ''),
      );
      const tokens = getICSTokens(ics);

      expect(tokens.get('BEGIN')).includes('VCALENDAR');
      expect(tokens.get('VERSION')).to.equal('2.0');
      expect(tokens.get('PRODID')).to.equal('VA');
      expect(tokens.get('BEGIN')).includes('VEVENT');
      expect(tokens.has('UID')).to.be.true;

      expect(tokens.get('SUMMARY')).to.equal(
        'VA Video Connect appointment at an ATLAS facility',
      );

      // Description text longer than 74 characters should start on newline beginning
      // with a tab character
      let description = tokens.get('DESCRIPTION');
      description = description.split(/(?=\t)/g); // look ahead include the split character in the results

      expect(description[0]).to.equal(
        'Join this video meeting from this ATLAS (non-VA) location:',
      );
      expect(description[1]).to.equal('\t\\n\\n114 Dewey Ave\\n');
      expect(description[2]).to.equal('\tEureka\\, MT 59917\\n');
      expect(description[3]).to.equal(
        '\t\\nYour appointment code is 7VBBCA. Use this code to find your appointment ',
      );
      expect(description[4]).to.equal(
        '\ton the computer at the ATLAS facility.\\n',
      );
      expect(description[5]).to.equal(
        "\t\\nYou'll be meeting with Meg Smith\\n",
      );
      expect(tokens.get('LOCATION')).to.equal(
        '114 Dewey Ave\\, Eureka\\, MT 59917',
      );
      expect(tokens.get('DTSTAMP')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTSTART')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTEND')).to.equal(
        `${startDate
          .clone()
          .add(20, 'minutes') // Default duration
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('END')).includes('VEVENT');
      expect(tokens.get('END')).includes('VCALENDAR');
    });

    it('should verify Video Connect on VA device calendar ics file format', async () => {
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
      await screen.findByText(/using VA device/);

      const ics = decodeURIComponent(
        screen
          .getByRole('link', {
            name: `Add ${startDate.format(
              'MMMM D, YYYY',
            )} appointment to your calendar`,
          })
          .getAttribute('href')
          .replace('data:text/calendar;charset=utf-8,', ''),
      );
      const tokens = getICSTokens(ics);

      expect(tokens.get('BEGIN')).includes('VCALENDAR');
      expect(tokens.get('VERSION')).to.equal('2.0');
      expect(tokens.get('PRODID')).to.equal('VA');
      expect(tokens.get('BEGIN')).includes('VEVENT');
      expect(tokens.has('UID')).to.be.true;

      expect(tokens.get('SUMMARY')).to.equal(
        'VA Video Connect appointment using a VA device',
      );

      // Description text longer than 74 characters should start on newline beginning
      // with a tab character
      let description = tokens.get('DESCRIPTION');
      description = description.split(/(?=\t)/g); // look ahead include the split character in the results

      expect(description[0]).to.equal(
        'Join this video meeting using a device provided by VA.',
      );
      expect(description[1]).to.equal(
        "\t\\nYou'll be meeting with Test T+90 Test\\n",
      );
      expect(tokens.get('LOCATION')).to.equal('');
      expect(tokens.get('DTSTAMP')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTSTART')).to.equal(
        `${moment(startDate)
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('DTEND')).to.equal(
        `${startDate
          .clone()
          .add(20, 'minutes') // Default mock duration
          .utc()
          .format('YYYYMMDDTHHmmss[Z]')}`,
      );
      expect(tokens.get('END')).includes('VEVENT');
      expect(tokens.get('END')).includes('VCALENDAR');
    });
  });
  describe('video appointments (css transition check)', () => {
    beforeEach(() => {
      mockFetch();
      mockFacilitiesFetch();
      mockFacilityFetch('vha_442', getVAFacilityMock({ id: '442' }));
    });
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
        instructionsTitle: 'Video Visit Preparation',
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
    it('should reveal medication review instructions', async () => {
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
        instructionsTitle: 'Medication Review',
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

      expect(
        await screen.findByText(
          /your provider will want to review all the medications/,
        ),
      ).to.be.ok;
    });
  });
});
