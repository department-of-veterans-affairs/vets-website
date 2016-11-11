import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DisabilityBenefitsApp, AppContent } from '../../../src/js/disability-benefits/containers/DisabilityBenefitsApp';

describe('<DisabilityBenefitsApp>', () => {
  it('should render children and login view', () => {
    const tree = SkinDeep.shallowRender(
      <DisabilityBenefitsApp
          available
          synced>
        <div className="test-child"/>
      </DisabilityBenefitsApp>
    );

    expect(tree.everySubTree('.test-child')).not.to.be.empty;
    expect(tree.everySubTree('RequiredLoginView')).not.to.be.empty;
    expect(tree.subTree('RequiredLoginView').props.serviceRequired).to.equal('disability-benefits');
    expect(tree.subTree('RequiredLoginView').props.authRequired).to.equal(3);
  });
  it('should render children', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent
          available
          synced>
        <div className="test-child"/>
      </AppContent>
    );

    expect(tree.everySubTree('.test-child')).not.to.be.empty;
    expect(tree.everySubTree('ClaimSyncWarning')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).to.be.empty;
  });
  it('should render unavailable when app is not authorized', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent
          available
          synced
          isDataAvailable={false}>
        <div className="test-child"/>
      </AppContent>
    );

    expect(tree.everySubTree('ClaimSyncWarning')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).not.to.be.empty;
  });
  it('should render sync warning', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent
          available>
        <div className="test-child"/>
      </AppContent>
    );

    expect(tree.everySubTree('.test-child')).not.to.be.empty;
    expect(tree.everySubTree('ClaimSyncWarning')).not.to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).to.be.empty;
  });
  it('should render unavailable', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent>
        <div className="test-child"/>
      </AppContent>
    );

    expect(tree.everySubTree('.test-child')).to.be.empty;
    expect(tree.everySubTree('ClaimSyncWarning')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).not.to.be.empty;
  });
});
