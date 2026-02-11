import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import Claim from '../../../components/claims-and-appeals/Claim';

function makeClaimObject({
  claimDate = '2021-01-21',
  claimType = 'Compensation',
  status = 'CLAIM_RECEIVED',
  decisionLetterSent = false,
  developmentLetterSent = false,
  documentsNeeded = false,
}) {
  return {
    id: '600214206',
    type: 'claim',
    attributes: {
      claimDate,
      claimType,
      decisionLetterSent,
      developmentLetterSent,
      documentsNeeded,
      status,
    },
  };
}

describe('Claim', () => {
  it('renders the claim heading with type and date', () => {
    const claim = makeClaimObject({});

    const { getByRole } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(
      getByRole('heading', {
        name: /Compensation claim received/,
      }),
    ).to.exist;
    expect(
      getByRole('heading', {
        name: /January 21, 2021/,
      }),
    ).to.exist;
  });

  it('renders the claim status description', () => {
    const claim = makeClaimObject({ status: 'CLAIM_RECEIVED' });

    const { getByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(getByText(/Status: Claim received/)).to.exist;
  });

  it('renders the Review details link with correct href', () => {
    const claim = makeClaimObject({});

    const { container } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    const link = container.querySelector('va-link[text="Review details"]');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/track-claims/your-claims/600214206/status',
    );
  });

  it('renders development letter notification when in progress and letter sent', () => {
    const claim = makeClaimObject({
      developmentLetterSent: true,
      status: 'INITIAL_REVIEW',
    });

    const { getByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(getByText(/We sent you a development letter/)).to.exist;
  });

  it('does not render development letter notification when claim is complete', () => {
    const claim = makeClaimObject({
      developmentLetterSent: true,
      status: 'COMPLETE',
    });

    const { queryByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(queryByText(/We sent you a development letter/)).to.not.exist;
  });

  it('does not render development letter notification when letter not sent', () => {
    const claim = makeClaimObject({
      developmentLetterSent: false,
      status: 'INITIAL_REVIEW',
    });

    const { queryByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(queryByText(/We sent you a development letter/)).to.not.exist;
  });

  it('renders decision letter notification when sent', () => {
    const claim = makeClaimObject({ decisionLetterSent: true });

    const { getByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(getByText(/We sent you a decision letter/)).to.exist;
  });

  it('does not render decision letter notification when not sent', () => {
    const claim = makeClaimObject({ decisionLetterSent: false });

    const { queryByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(queryByText(/We sent you a decision letter/)).to.not.exist;
  });

  it('renders documents needed notification when in progress and documents needed', () => {
    const claim = makeClaimObject({
      documentsNeeded: true,
      status: 'INITIAL_REVIEW',
    });

    const { getByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(getByText(/Items need attention/)).to.exist;
  });

  it('does not render documents needed notification when claim is complete', () => {
    const claim = makeClaimObject({
      documentsNeeded: true,
      status: 'COMPLETE',
    });

    const { queryByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(queryByText(/Items need attention/)).to.not.exist;
  });

  it('does not render documents needed notification when not needed', () => {
    const claim = makeClaimObject({
      documentsNeeded: false,
      status: 'INITIAL_REVIEW',
    });

    const { queryByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(queryByText(/Items need attention/)).to.not.exist;
  });

  it('throws when claim has no attributes', () => {
    const badClaim = { id: '123', type: 'claim' };
    expect(() => {
      renderWithStoreAndRouter(<Claim claim={badClaim} />, {
        initialState: {},
      });
    }).to.throw();
  });

  it('capitalizes the first letter of the claim type', () => {
    const claim = makeClaimObject({ claimType: 'dependency' });

    const { getByRole } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(
      getByRole('heading', {
        name: /Dependency claim received/,
      }),
    ).to.exist;
  });

  it('renders with a complete claim status (decisionLetterSent = true)', () => {
    const claim = makeClaimObject({
      decisionLetterSent: true,
      status: 'COMPLETE',
    });

    const { getByText } = renderWithStoreAndRouter(<Claim claim={claim} />, {
      initialState: {},
    });

    expect(getByText(/Status: Closed/)).to.exist;
    expect(getByText(/We sent you a decision letter/)).to.exist;
  });
});
