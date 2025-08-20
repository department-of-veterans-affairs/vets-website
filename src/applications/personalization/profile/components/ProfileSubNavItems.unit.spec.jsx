import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as ReactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';

import ProfileSubNavItems from './ProfileSubNavItems';

const defaultRoutes = [
  { path: '/profile/personal-information', name: 'Personal Info' },
  {
    path: '/profile/contact-information',
    name: 'Contact Info',
    requiresLOA3: true,
  },
  {
    path: '/profile/direct-deposit',
    name: 'Direct Deposit',
    requiresMVI: true,
  },
];

function renderSubNav(ui, { store }) {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
}

describe('ProfileSubNavItems', () => {
  let store;
  let useSelectorStub;
  beforeEach(() => {
    useSelectorStub = sinon.stub(ReactRedux, 'useSelector');
    store = {
      getState: () => ({}),
      subscribe: () => {},
      dispatch: () => {},
    };
  });

  afterEach(() => {
    useSelectorStub.restore();
  });

  it('renders all routes when requirements are met', () => {
    useSelectorStub.returns(false);
    const { container } = renderSubNav(
      <ProfileSubNavItems routes={defaultRoutes} isLOA3 isInMVI />,
      {
        store,
      },
    );

    expect(container.querySelector('va-sidenav-item[label="Personal Info"]')).to
      .exist;
    expect(container.querySelector('va-sidenav-item[label="Contact Info"]')).to
      .exist;
    expect(container.querySelector('va-sidenav-item[label="Direct Deposit"]'))
      .to.exist;
  });

  it('filters out LOA3 routes if not LOA3', () => {
    useSelectorStub.returns(false);
    const { container } = renderSubNav(
      <ProfileSubNavItems routes={defaultRoutes} isLOA3={false} isInMVI />,
      {
        store,
      },
    );
    expect(container.querySelector('va-sidenav-item[label="Personal Info"]')).to
      .exist;
    expect(container.querySelector('va-sidenav-item[label="Contact Info"]')).to
      .not.exist;
    expect(container.querySelector('va-sidenav-item[label="Direct Deposit"]'))
      .to.exist;
  });

  it('filters out LOA3 routes if user is blocked', () => {
    useSelectorStub.returns(true);
    const { container } = renderSubNav(
      <ProfileSubNavItems routes={defaultRoutes} isLOA3={false} isInMVI />,
      {
        store,
      },
    );
    expect(container.querySelector('va-sidenav-item[label="Personal Info"]')).to
      .exist;
    expect(container.querySelector('va-sidenav-item[label="Contact Info"]')).to
      .not.exist;
    expect(container.querySelector('va-sidenav-item[label="Direct Deposit"]'))
      .to.exist;
  });

  it('filters out MVI routes if not in MVI', () => {
    useSelectorStub.returns(false);
    const { container } = renderSubNav(
      <ProfileSubNavItems routes={defaultRoutes} isLOA3 isInMVI={false} />,
      {
        store,
      },
    );
    expect(container.querySelector('va-sidenav-item[label="Personal Info"]')).to
      .exist;
    expect(container.querySelector('va-sidenav-item[label="Contact Info"]')).to
      .exist;
    expect(container.querySelector('va-sidenav-item[label="Direct Deposit"]'))
      .to.not.exist;
  });
});
