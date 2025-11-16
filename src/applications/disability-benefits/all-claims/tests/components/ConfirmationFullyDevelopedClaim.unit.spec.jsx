import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationFullyDevelopedClaim from '../../components/confirmationFields/ConfirmationFullyDevelopedClaim';

describe('ConfirmationFullyDevelopedClaim', () => {
  it('should render correctly when standardClaim is false', () => {
    const formData = {
      standardClaim: false,
    };
    const { container, getByText } = render(
      <ConfirmationFullyDevelopedClaim formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText('Fully developed claim program')).to.exist;
    expect(
      getByText(
        'Do you want to apply using the Fully Developed Claim program?',
      ),
    ).to.exist;
    expect(getByText(/Yes, I have uploaded all my supporting documents./i)).to
      .exist;
  });

  it('should render correctly when standardClaim is true', () => {
    const formData = {
      standardClaim: true,
    };
    const { container, getByText } = render(
      <ConfirmationFullyDevelopedClaim formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText('Fully developed claim program')).to.exist;
    expect(
      getByText(
        'Do you want to apply using the Fully Developed Claim program?',
      ),
    ).to.exist;
    expect(
      getByText(
        /No, I have some extra information that I’ll submit to VA later./i,
      ),
    ).to.exist;
  });
});
