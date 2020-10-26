import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  CernerPrescriptionsWidget,
  CernerScheduleAnAppointmentWidget,
  CernerSecureMessagingWidget,
} from '../../components/cerner-widgets';

describe('Prescriptions Widget', () => {
  const facilityNames = ['Facility Name'];
  let view;
  beforeEach(() => {
    view = render(<CernerPrescriptionsWidget facilityNames={facilityNames} />);
  });
  it('renders the correct text, including the facility names', () => {
    expect(
      view.getByRole('heading', {
        name: /Refill and track prescriptions/i,
      }),
    ).to.exist;
    expect(
      view.getByRole('heading', {
        name: /Refill prescriptions from:/i,
      }),
    ).to.exist;
    expect(
      view.getAllByRole('heading', { name: new RegExp(facilityNames[0], 'i') })
        .length,
    ).to.equal(2);
  });
  it('renders the correct primary CTA button', () => {
    const myVAHealthButton = view.getByRole('link', {
      name: /Go to My VA Health/i,
    });
    expect(myVAHealthButton.href).to.equal(
      'https://ehrm-va-test.patientportal.us.healtheintent.com/clear-session?to=https%3A%2F%2Fehrm-va-test.patientportal.us.healtheintent.com%2Fpages%2Fmedications%2Fcurrent',
    );
  });
  it('renders the correct secondary CTA button', () => {
    const ctaButton = view.getByRole('link', {
      name: /Go to My HealtheVet/i,
    });
    expect(ctaButton.href).to.contain(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/web/myhealthevet/refill-prescription',
    );
  });
});

describe('Appointment Widget', () => {
  const facilityNames = ['Facility Name', 'Another Facility Name'];
  let view;
  beforeEach(() => {
    view = render(
      <CernerScheduleAnAppointmentWidget facilityNames={facilityNames} />,
    );
  });
  it('renders the correct text, including the facility names', () => {
    expect(
      view.getByRole('heading', {
        name: /View, schedule, or cancel an appointment/i,
      }),
    ).to.exist;
    expect(view.getByRole('heading', { name: /manage appointments at:/i })).to
      .exist;
    expect(
      view.getAllByRole('heading', { name: new RegExp(facilityNames[0], 'i') })
        .length,
    ).to.equal(2);
    expect(
      view.getAllByRole('heading', { name: new RegExp(facilityNames[1], 'i') })
        .length,
    ).to.equal(2);
  });
  it('renders the correct primary CTA button', () => {
    const myVAHealthButton = view.getByRole('link', {
      name: /Go to My VA Health/i,
    });
    expect(myVAHealthButton.href).to.equal(
      'https://ehrm-va-test.patientportal.us.healtheintent.com/clear-session?to=https%3A%2F%2Fehrm-va-test.patientportal.us.healtheintent.com%2Fpages%2Fscheduling%2Fupcoming',
    );
  });
  it('renders the correct alternate CTA button', () => {
    const ctaButton = view.getByRole('link', {
      name: /Go to the VA appointments tool/i,
    });
    expect(ctaButton.href).to.contain(
      '/health-care/schedule-view-va-appointments/',
    );
  });
});

describe('Secure Messaging Widget', () => {
  const facilityNames = ['Facility Name'];
  let view;
  beforeEach(() => {
    view = render(
      <CernerSecureMessagingWidget facilityNames={facilityNames} />,
    );
  });
  it('renders the correct text, including the facility names', () => {
    expect(
      view.getByRole('heading', {
        name: /Send or receive a secure message/i,
      }),
    ).to.exist;
    expect(
      view.getByRole('heading', {
        name: /Send a secure message to a provider at:/i,
      }),
    ).to.exist;
    expect(
      view.getAllByRole('heading', { name: new RegExp(facilityNames[0], 'i') })
        .length,
    ).to.equal(2);
  });
  it('renders the correct primary CTA button', () => {
    const myVAHealthButton = view.getByRole('link', {
      name: /Go to My VA Health/i,
    });
    expect(myVAHealthButton.href).to.equal(
      'https://ehrm-va-test.patientportal.us.healtheintent.com/clear-session?to=https%3A%2F%2Fehrm-va-test.patientportal.us.healtheintent.com%2Fpages%2Fmessaging%2Finbox',
    );
  });
  it('renders the correct alternate CTA button', () => {
    const ctaButton = view.getByRole('link', {
      name: /Go to My HealtheVet/i,
    });
    expect(ctaButton.href).to.contain(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/secure-messaging',
    );
  });
});
