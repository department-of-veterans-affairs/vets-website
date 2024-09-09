import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DigitalSubmissionAlert from '../../components/DigitalSubmissionAlert/DigitalSubmissionAlert';

describe('DigitalSubmissionAlert', () => {
  const getDigitalSubmissionAlert = () => render(<DigitalSubmissionAlert />);

  it('renders alert', () => {
    const { getByTestId } = getDigitalSubmissionAlert();
    expect(getByTestId('digital-submission-alert')).to.exist;
  });

  it('renders heading', () => {
    const { getByTestId } = getDigitalSubmissionAlert();
    expect(getByTestId('digital-submission-alert-heading').textContent).to.eq(
      'Veterans can now digitally submit form 21-22 from VA.gov',
    );
  });

  it('renders description', () => {
    const { getByTestId } = getDigitalSubmissionAlert();
    expect(getByTestId('digital-submission-alert-description')).to.exist;
  });
});
