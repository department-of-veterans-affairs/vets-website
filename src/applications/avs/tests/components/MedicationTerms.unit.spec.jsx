import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import MedicationTerms from '../../components/MedicationTerms';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;

describe('Avs: Medication Terms widget', () => {
  it('correctly renders all data', async () => {
    const props = {
      avs: avsData,
    };
    const screen = render(<MedicationTerms {...props} />);
    expect(screen.getAllByRole('heading')[1]).to.have.text('NON-VA ');
  });

  it('sections without data are hidden', async () => {
    const avsCopy = replacementFunctions.cloneDeep(avsData);
    delete avsCopy.pharmacyTerms;
    const props = {
      avs: avsCopy,
    };
    const screen = render(<MedicationTerms {...props} />);
    expect(screen.queryByRole('heading')).to.not.exist;
  });
});
