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
    expect(screen.getByTestId('new-orders-heading')).to.have.text(
      'New orders from this appointment',
    );
    expect(screen.getByTestId('consultations').firstChild).to.have.text(
      'Test Consultation',
    );
    expect(screen.getByTestId('imaging').firstChild).to.have.text(
      'Test Imaging',
    );
    expect(screen.getByTestId('lab-tests').children[1]).to.have.text(
      'HEMOGLOBIN A1C (LAB) BLOOD-LAVENDER$ (January 07, 2024)',
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
    expect(screen.getByTestId('new-medications-list')).to.contain.text(
      'KETOROLAC TROMETHAMINE INJ - give: 30mg im once',
    );
    expect(screen.getByTestId('discontinued-medications-list')).to.contain.text(
      'IBUPROFEN TAB - give: 800mg po now',
    );
    expect(screen.getByTestId('changed-medications-list')).to.contain.text(
      'ONDANSETRON TAB - give: 8mg po once',
    );
  });

  it('sections without data are hidden', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    delete avs.orders;
    delete avs.patientInstructions;
    delete avs.clinicalReminders;
    avs.medChangesSummary.discontinuedMeds = [];
    avs.medChangesSummary.newMedications = [];
    avs.medChangesSummary.changedMedications = [];
    const props = { avs };
    const screen = render(<YourTreatmentPlan {...props} />);
    expect(screen.queryByTestId('new-orders-heading')).to.not.exist;
    expect(screen.queryByTestId('consultations')).to.not.exist;
    expect(screen.queryByTestId('imaging')).to.not.exist;
    expect(screen.queryByTestId('lab-tests')).to.not.exist;
    expect(screen.queryByTestId('medications')).to.not.exist;
    expect(screen.queryByTestId('other-orders')).to.not.exist;
    expect(screen.queryByTestId('health-reminders')).to.not.exist;
    expect(screen.queryByTestId('other-instructions')).to.not.exist;
    expect(screen.queryByTestId('new-medications-list')).to.not.exist;
    expect(screen.queryByTestId('discontinued-medications-list')).to.not.exist;
    expect(screen.queryByTestId('changed-medications-list')).to.not.exist;
  });
});
