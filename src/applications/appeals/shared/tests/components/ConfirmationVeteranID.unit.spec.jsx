import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { ConfirmationVeteranID } from '../../components/ConfirmationVeteranID';
import { dob, userFullName, veteran } from '../data/veteran';

describe('ConfirmationVeteranID', () => {
  it('should render all fields', () => {
    const { container } = render(
      <ConfirmationVeteranID
        dob={dob}
        userFullName={userFullName}
        vaFileLastFour={veteran().vaFileLastFour}
      />,
    );

    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(3);
    const items = $$('li', container);
    expect(items.map(item => item.textContent)).to.deep.equal([
      'NameMike Wazowski',
      'VA File Number●●●–●●–8765V A file number ending with 8 7 6 5',
      'Date of birthOctober 28, 2001',
    ]);
  });

  it('should render without any data', () => {
    const { container } = render(<ConfirmationVeteranID />);

    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(1);
    const items = $$('li', container);
    expect(items.length).to.eq(2);
    expect(items.map(item => item.textContent)).to.deep.equal([
      'Name',
      'Date of birth',
    ]);
  });
});
