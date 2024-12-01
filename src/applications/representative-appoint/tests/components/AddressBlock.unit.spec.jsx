import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import AddressBlock from '../../components/AddressBlock';

describe('AddressBlock Component', () => {
  const addressData = {
    addressLine1: '123 Main Street',
    addressLine2: 'Suite 4B',
    addressLine3: '',
    city: 'Anytown',
    stateCode: 'AA',
    zipCode: '11111',
  };
  const repName = 'Steven McBob';
  const orgName = 'Best VSO';

  it('should render the representative and organization name', () => {
    const { container } = render(
      <AddressBlock
        repName={repName}
        orgName={orgName}
        addressData={addressData}
      />,
    );

    const addressBlock = $('.va-address-block', container);
    expect(addressBlock).to.exist;
    expect(addressBlock.textContent).to.contain(repName);
    expect(addressBlock.textContent).to.contain(orgName);
  });

  it('should render the address correctly', () => {
    const { container } = render(
      <AddressBlock
        repName={repName}
        orgName={orgName}
        addressData={addressData}
      />,
    );

    const addressBlock = $('.va-address-block', container);
    expect(addressBlock).to.exist;
    expect(addressBlock.textContent).to.contain('123 Main Street');
    expect(addressBlock.textContent).to.contain('Suite 4B');
    expect(addressBlock.textContent).to.contain('Anytown, AA 11111');
  });

  it('should render only the organization name if representative name is not provided', () => {
    const { container } = render(
      <AddressBlock
        repName={null}
        orgName={orgName}
        addressData={addressData}
      />,
    );

    const addressBlock = $('.va-address-block', container);
    expect(addressBlock).to.exist;
    expect(addressBlock.textContent).to.not.contain(repName);
    expect(addressBlock.textContent).to.contain(orgName);
  });
});
