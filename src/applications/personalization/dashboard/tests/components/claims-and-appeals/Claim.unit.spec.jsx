import React from 'react';
import { expect } from 'chai';
import { daysAgo } from '@@profile/tests/helpers';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import Claim from '../../../components/claims-and-appeals/Claim';
import ClaimLegacy from '../../../components/claims-and-appeals/ClaimLegacy';

function makeClaimObject({
  claimDate,
  dateFiled,
  updateDate,
  status = 'Claim received',
  decisionLetterSent = false,
  developmentLetterSent = false,
  documentsNeeded = false,
  claimType = 'Compensation',
  displayTitle = null,
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
      claimType,
      displayTitle,
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

    const tree = renderWithStoreAndRouter(<ClaimLegacy claim={claim} />, {
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

    const tree = renderWithStoreAndRouter(<ClaimLegacy claim={claim} />, {
      initialState: {},
    });

    expect(tree.getByText(/We sent you a decision letter/)).to.exist;
  });

  it('should render a notification when a development letter is sent', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      developmentLetterSent: true,
    });

    const tree = renderWithStoreAndRouter(<ClaimLegacy claim={claim} />, {
      initialState: {},
    });

    expect(tree.getByText(/We sent you a development letter/)).to.exist;
  });

  it('should render a notification when documents are needed', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      documentsNeeded: true,
    });

    const tree = renderWithStoreAndRouter(<ClaimLegacy claim={claim} />, {
      initialState: {},
    });

    expect(tree.getByText(/Items need attention/)).to.exist;
  });

  it('should render CHAMPVA card with matched pattern in legacy path', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      claimType: '10-10d-extended',
      displayTitle: 'Application for CHAMPVA benefits',
      status: 'COMPLETE',
      claimDate: '2026-02-05',
    });

    const tree = renderWithStoreAndRouter(<ClaimLegacy claim={claim} />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          benefits_claims_ivc_champva_provider: true,
        },
      },
    });

    expect(tree.getByText('RECEIVED')).to.exist;
    expect(tree.getByText(/Application for CHAMPVA benefits/)).to.exist;
    expect(tree.getByText(/VA Form 10-10d/)).to.exist;
    expect(tree.getByText(/Submitted on:/)).to.exist;
    expect(tree.getByText(/Received on:/)).to.exist;
    expect(tree.getByText(/Next step: We’ll review your form/)).to.exist;
    const reviewLink = tree.container.querySelector('a[href*="/your-claims/"]');
    expect(reviewLink).to.not.exist;
  });

  it('should render CHAMPVA card with matched pattern in redesign path', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      claimType: '10-10d-extended',
      displayTitle: 'Application for CHAMPVA benefits',
      status: 'COMPLETE',
      claimDate: '2026-02-05',
    });

    const tree = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          benefits_claims_ivc_champva_provider: true,
        },
      },
    });

    expect(tree.getByText('RECEIVED')).to.exist;
    expect(tree.getByText(/Application for CHAMPVA benefits/)).to.exist;
    expect(tree.getByText(/VA Form 10-10d/)).to.exist;
    expect(tree.getByText(/Submitted on:/)).to.exist;
    expect(tree.getByText(/Received on:/)).to.exist;
    expect(tree.getByText(/Next step: We’ll review your form/)).to.exist;
    const reviewLink = tree.container.querySelector(
      'va-link[text="Review details"]',
    );
    expect(reviewLink).to.not.exist;
  });

  it('should render CHAMPVA action needed pill for failed statuses in redesign path', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      claimType: '10-10d-extended',
      displayTitle: 'Application for CHAMPVA benefits',
      status: 'Submission failed',
      claimDate: '2026-02-05',
    });

    const tree = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          benefits_claims_ivc_champva_provider: true,
        },
      },
    });

    expect(tree.getByText('ACTION NEEDED')).to.exist;
  });
});
