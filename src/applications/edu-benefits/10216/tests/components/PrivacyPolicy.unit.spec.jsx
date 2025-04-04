import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import PrivacyPolicy from '../../components/PrivacyPolicy';

describe('Privacy Policy modal', () => {
  it('Renders correct privacy policy text to open modal', () => {
    const { getByTestId, getByText } = render(<PrivacyPolicy />);
    expect(getByText('I have read and accept the')).length.to.be(1);
    expect(getByTestId('privacy-policy-text')).to.exist;
  });
  it('Opens and closes the modal when clicked', async () => {
    const { container, getByText } = render(<PrivacyPolicy />);
    fireEvent.click(container.querySelector('va-link'));
    expect(getByText('Respondent Burden:')).to.be.visible;
    fireEvent.keyDown(container, { key: 'Enter' });
    await waitFor(() => {
      expect(getByText('Respondent Burden:')).to.not.be.visible;
    });
  });
});
