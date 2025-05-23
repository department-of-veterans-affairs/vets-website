import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { ConfirmationVeteranContact } from '../../components/ConfirmationVeteranContact';
import { veteran } from '../data/veteran';

describe('ConfirmationVeteranContact', () => {
  it('should render one phone field', () => {
    const { container } = render(
      <ConfirmationVeteranContact veteran={veteran()} />,
    );

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(3);
    expect(
      items.map(
        (item, index) => item[index === 0 ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
    ]);
  });

  it('should render two phone fields (SC)', () => {
    const { container } = render(
      <ConfirmationVeteranContact
        veteran={veteran(true, 'mobilePhone')}
        hasHomeAndMobilePhone
      />,
    );

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(4);
    expect(
      items.map(
        (item, index) =>
          item[[0, 1].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      '<va-telephone contact="5558002222" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
    ]);
  });
});
