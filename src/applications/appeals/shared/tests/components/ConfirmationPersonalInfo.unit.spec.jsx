import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import ConfirmationPersonalInfo, {
  VeteranInfo,
  VeteranContactInfo,
} from '../../components/ConfirmationPersonalInfo';

const dob = '2001-10-28';
const userFullName = {
  first: 'Mike',
  middle: '',
  last: 'Wazowski',
  suffix: '',
};
const veteran = (US = true, phone = 'phone') => ({
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
  [phone]: {
    countryCode: '6',
    areaCode: '555',
    phoneNumber: '8001111',
    extension: '2345',
  },
  homePhone: {
    countryCode: '7',
    areaCode: '555',
    phoneNumber: '8002222',
    extension: '5678',
  },
  email: 'user@example.com',
});

describe('ConfirmationPersonalInfo', () => {
  it('should render all fields for HLR & NOD', () => {
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

  it('should render all fields for SC', () => {
    const TestLi = () => (
      <li className="dd-privacy-hidden" data-dd-action-name="test">
        Testing
      </li>
    );
    const livingSituation = <TestLi />;
    const { container } = render(
      <ConfirmationPersonalInfo
        dob={dob}
        homeless
        userFullName={userFullName}
        veteran={veteran(true, 'mobilePhone')}
        livingSituation={livingSituation}
        hasHomeAndMobilePhone
      />,
    );

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(8);
    expect(
      items.map(
        (item, index) =>
          item[[4, 5].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Mike Wazowski',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'October 28, 2001',
      'Testing',
      '<va-telephone contact="5558002222" extension="5678" not-clickable="true"></va-telephone>',
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

describe('VeteranInfo', () => {
  it('should render all fields', () => {
    const { container } = render(
      <VeteranInfo
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
    const { container } = render(<VeteranInfo />);

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

describe('VeteranContactInfo', () => {
  it('should render one phone field', () => {
    const { container } = render(<VeteranContactInfo veteran={veteran()} />);

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
      <VeteranContactInfo
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
