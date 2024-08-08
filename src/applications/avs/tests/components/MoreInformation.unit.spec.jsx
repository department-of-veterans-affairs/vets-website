import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import MoreInformation from '../../components/MoreInformation';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

const avsData = mockAvs.data.attributes;

describe('Avs: Your Treatment Plan', () => {
  it('correctly renders all data', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    const props = { avs };
    const screen = render(<MoreInformation {...props} />);
    expect(screen.getByTestId('clinical-services').children[1]).to.contain.text(
      'CardiologyLocation: HartfordHours of operation: 0800-1830Phone: Comment:',
    );
    expect(
      screen.getByTestId('more-help-and-information').firstChild,
    ).to.contain.text(
      'This information is meant to provide a summary of your appointment with your health care provider.',
    );
  });

  it('sections without data are hidden', async () => {
    const avs = replacementFunctions.cloneDeep(avsData);
    avs.clinicalServices = null;
    avs.moreHelpAndInformation = null;
    const props = { avs };
    const screen = render(<MoreInformation {...props} />);
    expect(screen.queryByTestId('more-help-and-information')).to.not.exist;
    expect(screen.queryByTestId('clinical-services')).to.not.exist;
  });
});
