import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mount } from 'enzyme';
import { DeviceConnectionCard } from '../../components/DeviceConnectionCard';

describe('Device connection card', () => {
  it('Renders vendors name', () => {
    const card = renderInReduxProvider(
      <DeviceConnectionCard
        device={{ name: 'Fitbit', key: 'fitbit' }}
        authUrl="www.google.com"
      />,
    );
    expect(card.getByTestId('fitbit-name-header')).to.exist;
  });
  it('Renders vendor terms and conditions', () => {
    const card = renderInReduxProvider(
      <DeviceConnectionCard
        device={{ name: 'Fitbit', key: 'fitbit' }}
        authUrl="www.google.com"
      />,
    );
    expect(card.getByTestId('fitbit-terms-and-conditions')).to.exist;
    expect(card.getByTestId('fitbit-terms-and-conditions-content')).to.exist;
  });
  it('Has aria label for screen reader users', () => {
    const card = mount(
      <DeviceConnectionCard device={{ key: 'fitbit', name: 'Fitbit' }} />,
    );
    expect(
      card.find('[data-testid="fitbit-connect-link"]').prop('aria-label'),
    ).to.equal('Connect Fitbit');
    card.unmount();
  });
});
