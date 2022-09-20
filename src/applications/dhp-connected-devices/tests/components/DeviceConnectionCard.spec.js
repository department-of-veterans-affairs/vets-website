import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mount } from 'enzyme';
import { DeviceConnectionCard } from '../../components/DeviceConnectionCard';

describe('Device connection card', () => {
  it('Renders vendors name', () => {
    const card = renderInReduxProvider(
      <DeviceConnectionCard
        device={{ name: 'Test Vendor' }}
        authUrl="www.google.com"
      />,
    );

    expect(card.getByText(/Test Vendor/)).to.exist;
  });
  it('Has aria label for screen reader users', () => {
    const card = mount(
      <DeviceConnectionCard
        device={{ key: 'test-vendor', name: 'Test Vendor' }}
      />,
    );
    expect(
      card.find('[data-testid="test-vendor-connect-link"]').prop('aria-label'),
    ).to.equal('Connect Test Vendor');
    card.unmount();
  });
});
