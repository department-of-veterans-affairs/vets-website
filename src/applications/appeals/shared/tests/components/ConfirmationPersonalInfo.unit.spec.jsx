import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import ConfirmationPersonalInfo from '../../components/ConfirmationPersonalInfo';

describe('ConfirmationPersonalInfo', () => {
  const dob = '2001-10-28';
  const userFullName = {
    first: 'Mike',
    middle: '',
    last: 'Wazowski',
    suffix: '',
  };
  const veteran = (US = true) => ({
    vaFileLastFour: '8765',
    address: {
      addressType: US ? 'DOMESTIC' : 'INTERNATIONAL',
      addressLine1: '123 Main St',
      addressLine2: 'Suite #1200',
      addressLine3: 'Box 4567890',
      city: US ? 'New York' : 'Paris',
      countryName: US ? 'United States' : 'France',
      countryCodeIso2: US ? 'US' : 'FR',
      stateCode: US ? 'NY' : null,
      province: US ? null : 'Ile-de-France',
      zipCode: US ? '30012' : null,
      internationalPostalCode: US ? null : '75000',
    },
    phone: {
      countryCode: '6',
      areaCode: '555',
      phoneNumber: '8001111',
      extension: '2345',
    },
    email: 'user@example.com',
  });

  it('should render all fields', () => {
    const { container } = render(
      <ConfirmationPersonalInfo
        dob={dob}
        homeless
        userFullName={userFullName}
        veteran={veteran()}
      />,
    );

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(7);
    expect(
      items.map(
        (item, index) => item[index === 4 ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Mike Wazowski',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'October 28, 2001',
      'Yes',
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
    ]);
  });

  it('should render all fields with international address', () => {
    const { container } = render(
      <ConfirmationPersonalInfo
        dob={dob}
        homeless={false}
        userFullName={userFullName}
        veteran={veteran(false)}
      />,
    );

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(7);
    expect(
      items.map(
        (item, index) => item[index === 4 ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Mike Wazowski',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'October 28, 2001',
      'No',
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StParis, Ile-de-France, France 75000',
    ]);
  });

  it('should render without any data', () => {
    const { container } = render(<ConfirmationPersonalInfo />);

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(5);
    expect(
      items.map(
        (item, index) => item[index === 3 ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal(['', 'Not selected', '', '', ',  ']);
  });
});
