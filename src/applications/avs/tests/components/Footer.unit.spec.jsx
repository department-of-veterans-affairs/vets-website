import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import Footer from '../../components/Footer';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;

describe('Avs: Footer', () => {
  it('correctly renders', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    const props = { avs };
    const screen = render(<Footer {...props} />);
    expect(screen.getByTestId('avs-footer')).to.have.text(
      'Date and time generatedJuly 12, 2023 at 12:45 a.m. PT',
    );
  });

  it('component is empty if generation date is unavailable', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    delete avs.meta;
    const props = { avs };
    const screen = render(<Footer {...props} />);
    expect(screen.queryByTestId('avs-footer')).to.not.exist;
  });
});
