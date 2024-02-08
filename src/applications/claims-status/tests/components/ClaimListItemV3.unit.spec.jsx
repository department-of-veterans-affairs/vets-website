import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';

import ClaimsListItemV3 from '../../components/ClaimsListItemV3';

describe('<ClaimsListItemV3>', () => {
  it('should not show any flags', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: false,
        developmentLetterSent: false,
        documentsNeeded: false,
        status: 'CLAIM_RECEIVED',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.queryByRole('listitem')).not.to.exist;
  });

  it('should show closed status', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'COMPLETE',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.getByText('Step 5 of 5: Closed')).to.exist;
  });

  it('should show the correct status', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'INITIAL_REVIEW',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.getByText(/Initial review/i)).to.exist;
  });

  it('should show development letter flag', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: false,
        developmentLetterSent: true,
        documentsNeeded: false,
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.getByText('We sent you a development letter')).to.exist;
  });

  it('should show decision letter flag decisionLetterSent is true, but not render the other flags', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: true,
        developmentLetterSent: true,
        documentsNeeded: true,
        status: 'INITIAL_REVIEW',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.queryByText('We sent you a development letter')).to.be.null;
    expect(screen.queryByText('An item in the claim needs your attention')).to
      .be.null;
    expect(screen.getByText('You have a decision letter ready')).to.exist;
  });

  it('should show items needed flag', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: false,
        developmentLetterSent: false,
        documentsNeeded: true,
        status: 'INITIAL_REVIEW',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.getByText('An item in the claim needs your attention')).to
      .exist;
  });

  it('should not show any flags when closed', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: false,
        developmentLetterSent: true,
        documentsNeeded: true,
        status: 'COMPLETE',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.queryByRole('listitem')).not.to.exist;
  });

  it('should render a link to the claim status page', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'COMPLETE',
      },
    };

    const tree = shallow(<ClaimsListItemV3 claim={claim} />);
    const linkProps = tree
      .find('ClaimCardLink')
      .first()
      .props();
    expect(linkProps.href).to.equal(`your-claims/${claim.id}/status`);
    tree.unmount();
  });

  it('should render updated on and submitted on with proper dates', () => {
    const claim = {
      id: 1,
      attributes: {
        claimDate: '2019-02-10',
        claimPhaseDates: {
          phaseChangeDate: '2019-08-20',
        },
        status: 'COMPLETE',
      },
    };

    const screen = render(<ClaimsListItemV3 claim={claim} />);
    expect(screen.getByText(/Last updated: August 20, 2019/i)).to.exist;
    expect(screen.getByText(/Received on February 10, 2019/i)).to.exist;
  });
});
