import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import RxRenewalMessageSuccessAlert from '../../../components/shared/RxRenewalMessageSuccessAlert';

describe('RxRenewalMessageSuccessAlert', () => {
  const setup = () => {
    return render(<RxRenewalMessageSuccessAlert />);
  };

  it('should render the alert with correct content', () => {
    const screen = setup();
    expect(screen.getByTestId('rx-renewal-message-success-alert')).to.exist;
    expect(screen.getByText('Message Sent')).to.exist;
    expect(
      screen.getByText(
        'We shared your renewal request with your selected provider. It can take up to 3 days for your medication status to change.',
      ),
    ).to.exist;
  });

  it('should render link to sent messages', () => {
    const screen = setup();
    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/my-health/secure-messages/sent/',
    );
    expect(link.getAttribute('text')).to.equal(
      'Review message in your sent messages',
    );
  });

  it('should render with success status and role', () => {
    const screen = setup();
    const alert = screen.getByTestId('rx-renewal-message-success-alert');
    expect(alert.getAttribute('status')).to.equal('success');
    expect(alert.getAttribute('role')).to.equal('status');
  });

  it('should set focus on the alert when mounted', async () => {
    const screen = setup();
    const alert = screen.getByTestId('rx-renewal-message-success-alert');

    await waitFor(() => {
      expect(alert.getAttribute('tabindex')).to.equal('-1');
    });
  });
});
