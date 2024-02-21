import React from 'react';
import { render } from '@testing-library/react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

import { ClaimsStatusApp, AppContent } from '../../containers/ClaimsStatusApp';

describe('<ClaimsStatusApp>', () => {
  it('should render children and login view', () => {
    const tree = SkinDeep.shallowRender(
      <ClaimsStatusApp available authorized>
        <div className="test-child" />
      </ClaimsStatusApp>,
    );

    expect(tree.everySubTree('.test-child')).not.to.be.empty;
    expect(tree.everySubTree('RequiredLoginView')).not.to.be.empty;
    expect(tree.subTree('RequiredLoginView').props.serviceRequired).to.eql([
      backendServices.EVSS_CLAIMS,
      backendServices.APPEALS_STATUS,
      backendServices.LIGHTHOUSE,
    ]);
    expect(tree.subTree('RequiredLoginView').props.verify).to.be.true;
  });

  it('should render children', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent available authorized>
        <div className="test-child" />
      </AppContent>,
    );

    expect(tree.everySubTree('.test-child')).not.to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).to.be.empty;
  });

  it('should render loading indicator if feature toggles are not available', () => {
    const screen = render(
      <AppContent featureFlagsLoading>
        <div data-testid="children" />
      </AppContent>,
    );

    expect(screen.getByTestId('feature-flags-loading')).to.exist;
    expect(screen.queryByTestId('children')).to.not.exist;
  });

  it('should render children if feature toggles are available', () => {
    const screen = render(
      <AppContent featureFlagsLoading={false}>
        <div data-testid="children" />
      </AppContent>,
    );

    expect(screen.queryByTestId('feature-flags-loading')).to.not.exist;
    expect(screen.queryByTestId('children')).to.exist;
  });
});
