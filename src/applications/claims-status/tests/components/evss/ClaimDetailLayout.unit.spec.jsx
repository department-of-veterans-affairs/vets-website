import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, within } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimDetailLayout from '../../../components/evss/ClaimDetailLayout';

const store = createStore(() => ({}));

const getStore = (cstUseClaimDetailsV2Enabled = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
    },
  }));

describe('<ClaimDetailLayoutEVSS>', () => {
  it('should render loading indicator', () => {
    const tree = SkinDeep.shallowRender(<ClaimDetailLayout loading />);

    expect(tree.everySubTree('va-loading-indicator')).not.to.be.empty;
  });

  it('should render sync warning', () => {
    const claim = {
      attributes: {
        contentionList: ['Condition 1', 'Condition 2'],
      },
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout claim={claim} synced={false} />,
    );
    expect(tree.everySubTree('ClaimSyncWarning')).not.to.be.empty;
  });

  it('should render when the claim was submitted', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        dateFiled: '2023-11-23',
        vaRepresentative: 'Somebody',
        contentionList: ['Condition 1', 'Condition 2'],
      },
    };
    const screen = render(
      <Provider store={store}>
        <ClaimDetailLayout claim={claim} />
      </Provider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).to.contain.text(
      'Received on November 23, 2023',
    );
  });

  it('should render unavailable warning', () => {
    const claim = null;

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout claim={claim} synced={false} />,
    );
    expect(tree.everySubTree('ClaimsUnavailable')).to.have.lengthOf(1);
  });

  it('should render contention list', () => {
    const claim = {
      attributes: {
        contentionList: ['Condition 1', 'Condition 2'],
      },
    };

    const tree = SkinDeep.shallowRender(<ClaimDetailLayout claim={claim} />);

    expect(tree.subTree('.claim-contentions').text()).to.contain(
      'Condition 1, Condition 2',
    );
  });

  it('should render see all link if long contention list', () => {
    const claim = {
      id: 5,
      attributes: {
        contentionList: [
          'Condition 1',
          'Condition 2',
          'Condition 3',
          'Condition 4',
          'Condition 5',
        ],
      },
    };

    const tree = SkinDeep.shallowRender(<ClaimDetailLayout claim={claim} />);

    expect(tree.subTree('.claim-contentions').text()).to.contain(
      'Condition 1, Condition 2, Condition 3',
    );
    expect(
      tree.subTree('.claim-contentions').subTree('Link').props.to,
    ).to.equal('your-claims/5/details');
  });

  it('should render not available if no contention list', () => {
    const claim = {
      attributes: {
        contentionList: [],
      },
    };

    const tree = SkinDeep.shallowRender(<ClaimDetailLayout claim={claim} />);

    expect(tree.subTree('.claim-contentions').text()).to.contain(
      'Not available',
    );
  });

  it('should render adding details info if open', () => {
    const claim = {
      attributes: {
        open: true,
        contentionList: ['Condition 1', 'Condition 2'],
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
        open: false,
        contentionList: ['Condition 1', 'Condition 2'],
      },
    };

    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout currentTab="Status" claim={claim} />,
    );

    expect(tree.everySubTree('AddingDetails')).to.be.empty;
  });

  it('should render 3 tabs when toggle false', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2010-05-05',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };

    const { container } = render(
      <Provider store={getStore()}>
        <ClaimDetailLayout currentTab="Files" claim={claim} />
      </Provider>,
    );

    const tabList = $('.tabs', container);
    expect(within(tabList).getAllByRole('listitem').length).to.equal(3);
  });

  it('should render 3 tabs when toggle true', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2010-05-05',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };

    const { container } = render(
      <Provider store={getStore(true)}>
        <ClaimDetailLayout currentTab="Files" claim={claim} />
      </Provider>,
    );

    const tabList = $('.tabs', container);
    expect(within(tabList).getAllByRole('listitem').length).to.equal(3);
  });

  it('should render normal info', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        dateFiled: '2010-05-05',
        vaRepresentative: 'Somebody',
        contentionList: ['Condition 1', 'Condition 2'],
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
        contentionList: ['Condition 1', 'Condition 2'],
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
