import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
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
});
