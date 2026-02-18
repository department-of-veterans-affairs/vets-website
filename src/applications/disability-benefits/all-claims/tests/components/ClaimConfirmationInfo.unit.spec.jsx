import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ClaimConfirmationInfo } from '../../components/ClaimConfirmationInfo';

describe('ClaimConfirmationInfo', () => {
  const baseProps = {
    fullName: { first: 'Hector', middle: 'Lee', last: 'Brooks', suffix: 'Sr.' },
    dateSubmitted: new Date('November 7, 2024'),
    conditions: [],
    claimId: undefined,
    isSubmittingBDD: false,
  };

  it('renders the section headers and formatted name/date', () => {
    const { getByText } = render(<ClaimConfirmationInfo {...baseProps} />);

    getByText('Disability Compensation Claim');
    getByText('(Form 21-526EZ)');
    getByText('For Hector Lee Brooks Sr.');
    getByText('Date submitted');
    getByText('November 7, 2024');
    getByText('Conditions claimed');
  });

  it('renders each condition when the list is non-empty', () => {
    const props = { ...baseProps, conditions: ['Knee Pain', 'Tinnitus'] };
    const { getByText, queryByText } = render(
      <ClaimConfirmationInfo {...props} />,
    );

    getByText('Knee Pain');
    getByText('Tinnitus');
    expect(queryByText('No new conditions claimed')).to.be.null;
  });

  it('renders the fallback when there are no new conditions', () => {
    const props = { ...baseProps, conditions: [] };
    const { getByText, queryByText } = render(
      <ClaimConfirmationInfo {...props} />,
    );

    getByText('No new conditions claimed');
    expect(queryByText('Knee Pain')).to.be.null;
  });

  it('conditionally renders the Claim ID when provided', () => {
    const withId = { ...baseProps, claimId: 12345678 };
    const { getByText, rerender, queryByText } = render(
      <ClaimConfirmationInfo {...withId} />,
    );

    getByText('Claim ID number');
    getByText('12345678');

    rerender(<ClaimConfirmationInfo {...baseProps} />);
    expect(queryByText('Claim ID number')).to.be.null;
  });
});
