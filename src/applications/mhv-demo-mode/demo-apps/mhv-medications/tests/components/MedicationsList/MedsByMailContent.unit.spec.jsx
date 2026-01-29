import { expect } from 'chai';
import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import MedsByMailContent from '../../../components/MedicationsList/MedsByMailContent';

describe('MedsByMailContent component', () => {
  const setup = () => {
    return renderWithStoreAndRouterV6(<MedsByMailContent />, {
      reducers: reducer,
    });
  };

  it('renders correct content', () => {
    const screen = setup();

    expect(
      screen.getByText('If you use Meds by Mail', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;

    expect(
      screen.queryByText(
        'We may not have your allergy records in our My HealtheVet tools. But the Meds by Mail servicing center keeps a record of your allergies and reactions to medications.',
        {
          selector: 'p',
          exact: true,
        },
      ),
    ).to.exist;

    const additionalContentExpandedBlock = screen.queryByText(
      /If you have a new allergy or reaction, tell your provider\. Or you can call us at/,
      {
        selector: 'p',
      },
    );

    expect(additionalContentExpandedBlock).to.exist;

    expect(
      screen.queryByText(
        /and ask us to update your records. We’re here Monday through Friday, 8:00 a\.m\. to 7:30 p\.m\. ET./,
        {
          selector: 'p',
        },
      ),
    ).to.exist;

    const telephoneElements = Array.from(
      additionalContentExpandedBlock.querySelectorAll('va-telephone'),
    );

    const telephoneAttributes = telephoneElements.map(node => [
      node.getAttribute('contact'),
      node.getAttribute('tty'),
    ]);

    expect(telephoneAttributes).to.deep.equal([
      ['8662297389', null],
      ['8883850235', null],
      [CONTACTS[711], 'true'],
    ]);
  });
});
