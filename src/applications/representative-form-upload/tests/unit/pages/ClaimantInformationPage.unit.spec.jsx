import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantInformationPage } from '../../../pages/claimantInformation';

describe('ClaimantInformationPage', () => {
  const subject = () => render(<ClaimantInformationPage />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});
