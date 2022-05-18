import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { render, fireEvent } from '@testing-library/react';
import { DeviceDisconnectionCard } from '../../components/DeviceDisconnectionCard';

describe('Device disconnection card', () => {
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

describe('Device disconnection card modal', () => {
  it('Should show modal when disconnect is clicked', async () => {
    const { getByText, getByRole, getByTestId } = render(
      <DeviceDisconnectionCard device={{ name: 'Test Vendor', key: 'test' }} />,
    );
    const disconnectBtn = getByRole('button', { name: 'Disconnect' });
    await fireEvent.click(disconnectBtn);
    const modal = getByTestId('disconnect-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('modalTitle')).to.eq('Disconnect device');
    expect(
      getByText(
        'Disconnecting your Test Vendor will stop sharing data with the VA.',
      ),
    ).to.exist;
    expect(modal.getAttribute('primaryButtonText')).to.eq('Disconnect device');
    expect(modal.getAttribute('secondaryButtonText')).to.eq('Go back');
  });
});
