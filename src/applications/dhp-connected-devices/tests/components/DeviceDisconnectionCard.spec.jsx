import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { DeviceDisconnectionCard } from '../../components/DeviceDisconnectionCard';

describe('Device to connect card', () => {
  it('Renders vendors name', () => {
    const card = renderInReduxProvider(
      <DeviceDisconnectionCard
        device={{ name: 'Test Vendor' }}
        onClickHandler="www.google.com"
      />,
    );

    expect(card.getByText(/Test Vendor/)).to.exist;
  });
});
