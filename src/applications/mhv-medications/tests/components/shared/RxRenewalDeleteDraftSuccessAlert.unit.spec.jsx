import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RxRenewalDeleteDraftSuccessAlert from '../../../components/shared/RxRenewalDeleteDraftSuccessAlert';

describe('RxRenewalDeleteDraftSuccessAlert', () => {
  const setup = () => {
    return render(<RxRenewalDeleteDraftSuccessAlert />);
  };

  it('should render the alert with correct content', () => {
    const screen = setup();
    expect(screen.getByTestId('rx-renewal-delete-draft-success-alert')).to
      .exist;
    expect(screen.getByText('You successfully deleted your draft.')).to.exist;
  });

  it('should render with success status, role, and slim style', () => {
    const screen = setup();
    const alert = screen.getByTestId('rx-renewal-delete-draft-success-alert');
    expect(alert.getAttribute('status')).to.equal('success');
    expect(alert.getAttribute('role')).to.equal('status');
    expect(alert.getAttribute('slim')).to.exist;
  });

  it('should be closeable', () => {
    const screen = setup();
    const alert = screen.getByTestId('rx-renewal-delete-draft-success-alert');
    expect(alert.getAttribute('closeable')).to.exist;
  });

  it('should hide when close event is triggered', async () => {
    const screen = setup();
    const alert = screen.getByTestId('rx-renewal-delete-draft-success-alert');

    expect(alert.getAttribute('visible')).to.equal('true');
    fireEvent(alert, new CustomEvent('closeEvent'));
    expect(alert.getAttribute('visible')).to.equal('false');
  });

  it('should set focus on the alert when mounted', async () => {
    const screen = setup();
    const alert = screen.getByTestId('rx-renewal-delete-draft-success-alert');

    await waitFor(() => {
      expect(alert.getAttribute('tabindex')).to.equal('-1');
    });
  });
});
