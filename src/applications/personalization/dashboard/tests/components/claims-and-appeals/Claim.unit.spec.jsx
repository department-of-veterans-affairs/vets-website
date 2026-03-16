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

  it('should render CHAMPVA card with In Progress pill in legacy path', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      claimType: '10-10d-extended',
      displayTitle: 'Application for CHAMPVA benefits',
      status: 'CLAIM_RECEIVED',
      claimDate: '2026-02-05',
    });

    const tree = renderWithStoreAndRouter(<ClaimLegacy claim={claim} />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          ivc_champva_cst_integration: true,
        },
      },
    });

    expect(tree.getByText('In Progress')).to.exist;
    expect(tree.getByText(/Application for CHAMPVA benefits/)).to.exist;
    expect(tree.getByText(/VA Form 10-10d/)).to.exist;
    expect(tree.getByText(/Received on/)).to.exist;
    expect(tree.queryByText(/Submitted on:/)).to.not.exist;
    expect(tree.getByText(/Step 1 of 2: Application received/)).to.exist;
    expect(tree.getByText(/Moved to this step on/)).to.exist;
    const detailsLink = tree.container.querySelector(
      'a[href*="/your-claims/"]',
    );
    expect(detailsLink).to.exist;
  });

  it('should not render a pill for COMPLETE CHAMPVA status in legacy path', () => {
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
          ivc_champva_cst_integration: true,
        },
      },
    });

    expect(tree.queryByText('In Progress')).to.not.exist;
    expect(tree.queryByText('RECEIVED')).to.not.exist;
    expect(tree.getByText(/Step 2 of 2: Application decided/)).to.exist;
  });

  it('should render CHAMPVA card with In Progress pill in redesign path', () => {
    const claim = makeClaimObject({
      updateDate: daysAgo(15),
      claimType: '10-10d-extended',
      displayTitle: 'Application for CHAMPVA benefits',
      status: 'CLAIM_RECEIVED',
      claimDate: '2026-02-05',
    });

    const tree = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          ivc_champva_cst_integration: true,
        },
      },
    });

    expect(tree.getByText('In Progress')).to.exist;
    expect(tree.getByText(/Application for CHAMPVA benefits/)).to.exist;
    expect(tree.getByText(/VA Form 10-10d/)).to.exist;
    expect(tree.getByText(/Received on/)).to.exist;
    expect(tree.queryByText(/Submitted on:/)).to.not.exist;
    expect(tree.getByText(/Step 1 of 2: Application received/)).to.exist;
    expect(tree.getByText(/Moved to this step on/)).to.exist;
    const detailsLink = tree.container.querySelector(
      'va-link[href*="/your-claims/"]',
    );
    expect(detailsLink).to.exist;
  });

  it('should not render a pill for COMPLETE CHAMPVA status in redesign path', () => {
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
          ivc_champva_cst_integration: true,
        },
      },
    });

    expect(tree.queryByText('In Progress')).to.not.exist;
    expect(tree.queryByText('RECEIVED')).to.not.exist;
    expect(tree.getByText(/Step 2 of 2: Application decided/)).to.exist;
  });

  it('should render In Progress pill for non-complete CHAMPVA statuses in redesign path', () => {
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
          ivc_champva_cst_integration: true,
        },
      },
    });

    expect(tree.getByText('In Progress')).to.exist;
    expect(tree.getByText(/Step 1 of 2: Application received/)).to.exist;
  });
});
