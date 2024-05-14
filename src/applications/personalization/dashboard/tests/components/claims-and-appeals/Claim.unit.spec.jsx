import React from 'react';
import { expect } from 'chai';
import { daysAgo } from '@@profile/tests/helpers';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import Claim from '../../../components/claims-and-appeals/Claim';

function makeClaimObject({
  claimDate,
  dateFiled,
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
      evssId: 600214206,
      claimDate: claimDate || '2021-01-21',
      claimPhaseDates: {
        phaseChangeDate: updateDate,
      },
      claimType: 'Compensation',
      closeDate: null,
      dateFiled: dateFiled || '2021-01-21',
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

    const tree = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(
      tree.getByRole('heading', {
        name: /Compensation claim received January 21, 2021/,
      }),
    ).to.exist;
    expect(tree.getByText(/Review details/)).to.exist;
  });

  it('should render a notification when a decision letter is sent', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      decisionLetterSent: true,
    });

    const tree = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(tree.getByText(/We sent you a decision letter/)).to.exist;
  });

  it('should render a notification when a development letter is sent', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      developmentLetterSent: true,
    });

    const tree = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(tree.getByText(/We sent you a development letter/)).to.exist;
  });

  it('should render a notification when documents are needed', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      documentsNeeded: true,
    });

    const tree = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(tree.getByText(/Items need attention/)).to.exist;
  });
});
