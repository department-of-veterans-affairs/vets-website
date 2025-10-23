import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import YourAppointment from '../../components/YourAppointment.tsx';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;

describe('Avs: Your Appointment', () => {
  it('correctly renders all data', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    const props = { avs };
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
    expect(screen.getByTestId('vitals').children[1].children[3]).to.have.text(
      'Pulse OximetryResult: 100 (Room Air)',
    );
    expect(screen.getByTestId('vitals').children[1].children[4]).to.have.text(
      'HeightResult: 66 in',
    );
    expect(screen.getByTestId('procedure-list').children[1]).to.have.text(
      'SARSCOV2 VAC 5X1010VP/.5MLIM',
    );
    expect(screen.getByTestId('clinic-medications')).to.contain.text(
      'Ketorolac Tromethamine Inj',
    );
  });

  it('sections without data are hidden', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    delete avs.reasonForVisit;
    delete avs.diagnoses;
    avs.providers = null;
    avs.vitals = [];
    delete avs.procedures;
    delete avs.clinicMedications;
    delete avs.vaMedications;
    const props = { avs };
    const screen = render(<YourAppointment {...props} />);
    expect(screen.queryByTestId('reason-for-appt-list')).to.not.exist;
    expect(screen.queryByTestId('diagnoses-list')).to.not.exist;
    expect(screen.queryByTestId('provider-list')).to.not.exist;
    expect(screen.queryByTestId('vitals')).to.not.exist;
    expect(screen.queryByTestId('procedures')).to.not.exist;
    expect(screen.queryByTestId('clinic-medications')).to.not.exist;
  });

  it('Reason for visit section is not shown when it contains only empty values', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    avs.reasonForVisit = [
      {
        diagnosis: null,
        code: null,
      },
    ];
    const props = { avs };
    const screen = render(<YourAppointment {...props} />);
    expect(screen.queryByTestId('reason-for-appt-list')).to.not.exist;
  });
});
