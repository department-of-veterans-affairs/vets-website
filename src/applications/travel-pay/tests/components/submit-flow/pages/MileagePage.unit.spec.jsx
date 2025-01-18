import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import MileagePage from '../../../../components/submit-flow/pages/MileagePage';

const appointment = {
  resourceType: 'Appointment',
  id: 'aa6bb54b5f8ba22a82720a30abdfa3efe0805cc0dc1b6b248815e942ad61847e',
  status: 'booked',
  cancelationReason: null,
  start: '2024-11-20T10:30:00-05:00',
  patientComments: null,
  reasonForAppointment: 'Medication concern',
  timezone: 'Asia/Manila',
  description: 'VAOS_UNKNOWN',
  minutesDuration: 60,
  practitioners: [
    {
      identifier: [
        {
          system: 'https://veteran.apps.va.gov/terminology/fhir/sid/secid',
          value: null,
        },
      ],
      name: {
        family: 'BERNARDO',
        given: ['KENNETH J'],
      },
    },
  ],
  location: {
    vistaId: '983',
    clinicId: '945',
    stationId: '983GC',
    clinicName: 'C&P BEV AUDIO FTC',
    clinicPhysicalLocation: 'FORT COLLINS AUDIO',
    clinicPhone: null,
    clinicPhoneExtension: null,
  },
  videoData: {
    isVideo: false,
  },
  communityCareProvider: null,
  preferredProviderName: null,
  vaos: {
    isPendingAppointment: false,
    isUpcomingAppointment: false,
    isVideo: false,
    isPastAppointment: true,
    isCompAndPenAppointment: true,
    isCancellable: false,
    appointmentType: 'vaAppointment',
    isCommunityCare: false,
    isExpressCare: false,
    isPhoneAppointment: false,
    isCOVIDVaccine: false,
    apiData: {
      id: '167322',
      identifier: [
        {
          system: 'Appointment/',
          value: '4139383339353233',
        },
      ],
      kind: 'clinic',
      status: 'booked',
      serviceType: 'audiology',
      serviceTypes: [
        {
          coding: [
            {
              system:
                'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
              code: 'audiology',
            },
          ],
        },
      ],
      serviceCategory: [
        {
          coding: [
            {
              system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
              code: 'COMPENSATION & PENSION',
              display: 'COMPENSATION & PENSION',
            },
          ],
          text: 'COMPENSATION & PENSION',
        },
      ],
      patientIcn: '1013120826V646496',
      locationId: '983GC',
      localStartTime: '2024-11-20T10:30:00.000+08:00',
      clinic: '945',
      start: '2024-11-20T09:30:00Z',
      end: '2024-11-20T10:00:00Z',
      created: '2024-03-17T00:00:00Z',
      cancellable: false,
      extension: {
        ccLocation: {
          address: {},
        },
        vistaStatus: ['NO ACTION TAKEN'],
      },
      serviceName: 'FTC C&P AUDIO BEV',
      physicalLocation: 'FORT COLLINS AUDIO',
      friendlyName: 'C&P BEV AUDIO FTC',
      practitioners: [
        {
          identifier: [
            {
              system: 'https://veteran.apps.va.gov/terminology/fhir/sid/secid',
              value: null,
            },
          ],
          name: {
            family: 'BERNARDO',
            given: ['KENNETH J'],
          },
        },
      ],
      location: {
        id: '983GC',
        type: 'appointments',
        attributes: {
          id: '983GC',
          vistaSite: '983',
          vastParent: '983',
          type: 'va_facilities',
          name: 'Fort Collins VA Clinic',
          classification: 'Multi-Specialty CBOC',
          timezone: {
            timeZoneId: 'Asia/Manila',
          },
          lat: 40.553875,
          long: -105.08795,
          website:
            'https://www.cheyenne.va.gov/locations/Fort_Collins_VA_CBOC.asp',
          phone: {
            main: '970-224-1550',
          },
          physicalAddress: {
            line: ['2509 Research Boulevard'],
            city: 'Fort Collins',
            state: 'CO',
            postalCode: '80526-8108',
          },
          healthService: [
            'Audiology',
            'EmergencyCare',
            'MentalHealthCare',
            'PrimaryCare',
            'SpecialtyCare',
          ],
        },
      },
      claim: {
        message: 'No claim for this appointment',
      },
    },
    timeZone: 'Asia/Manila',
    facilityData: {
      resourceType: 'Location',
      id: '983GC',
      vistaId: '983',
      name: 'Fort Collins VA Clinic',
      identifier: [
        {
          system: 'http://med.va.gov/fhir/urn',
          value: 'urn:va:division:983:983GC',
        },
        {
          system: 'urn:oid:2.16.840.1.113883.6.233',
          value: '983GC',
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: '970-224-1550',
        },
      ],
      position: {
        longitude: -105.08795,
        latitude: 40.553875,
      },
      address: {
        line: ['2509 Research Boulevard'],
        city: 'Fort Collins',
        state: 'CO',
        postalCode: '80526-8108',
      },
    },
  },
  version: 2,
};

describe('Mileage page', () => {
  const props = {
    appointment,
    pageIndex: 1,
    setPageIndex: () => {},
    yesNo: {
      mileage: '',
      vehicle: '',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType: () => {},
  };

  it('should render correctly', async () => {
    const screen = render(<MileagePage {...props} />);

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    expect(screen.findByText('Fort Collins VA Clinic')).to.exist;
    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(`va-additional-info[trigger="How do we calculate mileage"]`),
    );
    await waitFor(() => {
      expect(screen.findByText(/We pay round-trip mileage/i)).to.exist;
    });

    fireEvent.click(
      $(`va-additional-info[trigger="If you have other expenses to claim"]`),
    );
    await waitFor(() => {
      expect(screen.findByText(/submit receipts for other expenses/i)).to.exist;
    });
  });

  it('should render an error if no selection made', async () => {
    const screen = render(<MileagePage {...props} />);

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(screen.findByText(/You must make a selection/i)).to.exist;
    });
  });
});
