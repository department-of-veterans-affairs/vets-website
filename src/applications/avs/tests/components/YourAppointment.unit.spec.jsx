import React from 'react';
import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { render } from '@testing-library/react';
import YourAppointment from '../../components/YourAppointment';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avs = mockAvs.data.attributes;
const props = { avs };

describe('Avs', () => {
  it('Your Appointment correctly renders', async () => {
    mockApiRequest(mockAvs);
    const screen = render(<YourAppointment {...props} />);
    expect(screen.getByTestId('appointment-time')).to.have.text('8:30 a.m. PT');
    expect(screen.getByTestId('provider-list').firstChild).to.have.text(
      'DOCTOR,GREAT B - ACOS/EDUC.',
    );
    expect(screen.getByTestId('reason-for-appt-list').firstChild).to.have.text(
      'Coronary arteriosclerosis',
    );
    expect(screen.getByTestId('diagnoses-list').children[1]).to.have.text(
      'Dyslipidemia',
    );
    expect(screen.getByTestId('vitals').children[4]).to.have.text(
      'Pulse OximetryResult: 100',
    );
    expect(screen.getByTestId('clinic-medications').children[2].nodeName).to.eq(
      'VA-ADDITIONAL-INFO',
    );
  });
});
