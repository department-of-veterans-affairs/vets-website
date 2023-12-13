import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render } from '@testing-library/react';

const store = createStore(() => ({}));

import ClaimDetailLayout from '../../components/ClaimDetailLayout';

describe('<ClaimDetailLayout>', () => {
  it('should render loading indicator', () => {
    const tree = SkinDeep.shallowRender(<ClaimDetailLayout loading />);

    expect(tree.everySubTree('va-loading-indicator')).not.to.be.empty;
  });

  it('should render sync warning', () => {
    const claim = {
      attributes: {
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout claim={claim} synced={false} />,
    );
    expect(tree.everySubTree('ClaimSyncWarning')).not.to.be.empty;
  });

  it('should render unavailable warning', () => {
    const claim = null;

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout claim={claim} synced={false} />,
    );
    expect(tree.everySubTree('ClaimsUnavailable')).to.have.lengthOf(1);
  });

  it('should render when the claim was submitted', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2023-11-23',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };
    const screen = render(
      <Provider store={store}>
        <ClaimDetailLayout claim={claim} />
      </Provider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).to.contain.text(
      'Submitted on November 23, 2023',
    );
  });

  it('should render adding details info if open', () => {
    const claim = {
      attributes: {
        closeDate: null,
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
        status: 'INITIAL_REVIEW',
      },
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout currentTab="Status" claim={claim} />,
    );

    expect(tree.everySubTree('AddingDetails')).not.to.be.empty;
  });

  it('should not render adding details info if closed', () => {
    const claim = {
      attributes: {
        closeDate: '2023-04-28',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
        status: 'COMPLETE',
      },
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout currentTab="Status" claim={claim} />,
    );

    expect(tree.everySubTree('AddingDetails')).to.be.empty;
  });

  it('should render normal info', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2010-05-05',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout currentTab="Status" claim={claim}>
        <div className="child-content" />
      </ClaimDetailLayout>,
    );

    expect(tree.everySubTree('AddingDetails')).to.be.empty;
    expect(tree.everySubTree('.child-content')).not.to.be.empty;
  });
  it('should render message', () => {
    const claim = {
      attributes: {
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };
    const message = {
      title: 'Test',
      body: 'Testing',
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout message={message} claim={claim} />,
    );

    expect(tree.subTree('Notification')).not.to.be.false;
  });
});
