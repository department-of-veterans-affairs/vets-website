import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { daysAgo } from '@@profile/tests/helpers';

import Claim from '../../../components/claims-and-appeals/Claim';

function makeClaimObject({
  claimDate,
  updateDate,
  status = 'Claim received',
  decisionLetterSent = false,
  developmentLetterSent = false,
  documentsNeeded = false,
}) {
  return {
    id: '600214206',
    type: 'claim',
    attributes: {
      claimDate: claimDate || '2021-01-21',
      claimPhaseDates: {
        phaseChangeDate: updateDate,
      },
      claimType: 'Compensation',
      closeDate: null,
      decisionLetterSent,
      developmentLetterSent,
      documentsNeeded,
      endProductCode: '404',
      evidenceWaiverSubmitted5103: false,
      lighthouseId: 600214206,
      status,
    },
  };
}

describe('<Claim />', () => {
  it('should render', () => {
    const claim = makeClaimObject({ updateDate: daysAgo(15) });

    const tree = render(<Claim claim={claim} />);

    expect(tree.getByText(/Compensation claim received/)).to.exist;
    expect(tree.getByText(/Review details/)).to.exist;
  });

  it('should render a notification when a decision letter is sent', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      decisionLetterSent: true,
    });

    const tree = render(<Claim claim={claim} />);

    expect(tree.getByText(/We sent you a decision letter/)).to.exist;
  });

  it('should render a notification when a development letter is sent', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      developmentLetterSent: true,
    });

    const tree = render(<Claim claim={claim} />);

    expect(tree.getByText(/We sent you a development letter/)).to.exist;
  });

  it('should render a notification when documents are needed', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      documentsNeeded: true,
    });

    const tree = render(<Claim claim={claim} />);

    expect(tree.getByText(/Items need attention/)).to.exist;
  });
});
