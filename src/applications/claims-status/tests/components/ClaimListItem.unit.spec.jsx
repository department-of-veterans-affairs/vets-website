import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';

import ClaimsListItem from '../../components/ClaimsListItem';

describe('<ClaimsListItem>', () => {
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

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.queryByRole('listitem')).not.to.exist;
  });

  it('should show closed status', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'COMPLETE',
      },
    };

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.getByText('Step 5 of 5: Closed')).to.exist;
  });

  it('should show the correct status', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'INITIAL_REVIEW',
      },
    };

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.getByText(/Initial review/i)).to.exist;
  });

  it('should show development letter flag', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: false,
        developmentLetterSent: true,
        documentsNeeded: false,
        status: 'INITIAL_REVIEW',
      },
    };

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.getByText('We sent you a development letter')).to.exist;
  });

  it('should show development letter flag', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: false,
        developmentLetterSent: true,
        documentsNeeded: false,
        status: 'INITIAL_REVIEW',
      },
    };

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.getByText('We sent you a development letter')).to.exist;
  });

  it('should show decision letter flag', () => {
    const claim = {
      id: 1,
      attributes: {
        decisionLetterSent: true,
        developmentLetterSent: false,
        documentsNeeded: false,
        status: 'INITIAL_REVIEW',
      },
    };

    const screen = render(<ClaimsListItem claim={claim} />);
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

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.getByText('Items need attention')).to.exist;
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

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.queryByRole('listitem')).not.to.exist;
  });

  it('should render a status circle with the `closed` class', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'COMPLETE',
      },
    };

    const tree = shallow(<ClaimsListItem claim={claim} />);
    const circle = tree.find('.status-circle').first();

    expect(circle.hasClass('open-claim')).to.be.false;
    expect(circle.hasClass('closed-claim')).to.be.true;
    tree.unmount();
  });

  it('should render a link to the claim status page', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'COMPLETE',
      },
    };

    const tree = shallow(<ClaimsListItem claim={claim} />);
    const linkProps = tree
      .find('Link')
      .first()
      .props();
    expect(linkProps.to).to.equal(`your-claims/${claim.id}/status`);
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

    const screen = render(<ClaimsListItem claim={claim} />);
    expect(screen.getByText(/updated on August 20, 2019/i)).to.exist;
    expect(screen.getByText(/Received on/i)).to.exist;
    expect(screen.getByText(/February 10, 2019/i)).to.exist;
  });
});
