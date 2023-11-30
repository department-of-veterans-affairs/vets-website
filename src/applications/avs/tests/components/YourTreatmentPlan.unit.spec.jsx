import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import YourTreatmentPlan from '../../components/YourTreatmentPlan';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;

describe('Avs: Your Treatment Plan', () => {
  it('correctly renders all data', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    const props = { avs };
    const screen = render(<YourTreatmentPlan {...props} />);
    expect(screen.getByTestId('consultations').firstChild).to.have.text(
      'Test Consultation',
    );
    expect(screen.getByTestId('imaging').firstChild).to.have.text(
      'Test Imaging',
    );
    expect(screen.getByTestId('lab-tests').children[1]).to.have.text(
      'HEMOGLOBIN A1C (LAB) BLOOD-LAVENDER$',
    );
    expect(screen.getByTestId('medications').firstChild).to.have.text(
      'Test Medication',
    );
    expect(screen.getByTestId('other-orders').children[1]).to.contain.text(
      'PACT ALERT BRAVO\nConcern:',
    );
    expect(
      screen.getByTestId('health-reminders').children[2].firstChild,
    ).to.contain.text(
      'Hepatitis C risk Factor ScreeningWhen due: DUE NOWFrequency:  Due every 3 years for all ages.',
    );
    expect(screen.getByTestId('other-instructions')).to.contain.text(
      'Recommend acetaminophen 500 mg',
    );
  });

  it('sections without data are hidden', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    delete avs.orders;
    delete avs.patientInstructions;
    delete avs.clinicalReminders;
    const props = { avs };
    const screen = render(<YourTreatmentPlan {...props} />);
    expect(screen.queryByTestId('consultations')).to.not.exist;
    expect(screen.queryByTestId('imaging')).to.not.exist;
    expect(screen.queryByTestId('lab-tests')).to.not.exist;
    expect(screen.queryByTestId('medications')).to.not.exist;
    expect(screen.queryByTestId('other-orders')).to.not.exist;
    expect(screen.queryByTestId('health-reminders')).to.not.exist;
    expect(screen.queryByTestId('other-instructions')).to.not.exist;
  });
});
