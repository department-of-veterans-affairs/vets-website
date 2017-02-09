import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DisabilityBenefitsApp, AppContent } from '../../../src/js/disability-benefits/containers/DisabilityBenefitsApp';

describe('<DisabilityBenefitsApp>', () => {
  it('should render children and login view', () => {
    const tree = SkinDeep.shallowRender(
      <DisabilityBenefitsApp
          available
          authorized>
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
          authorized>
        <div className="test-child"/>
      </AppContent>
    );

    expect(tree.everySubTree('.test-child')).not.to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).to.be.empty;
  });
  it('should render unavailable when app is not allowed', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent
          available
          authorized
          isDataAvailable={false}>
        <div className="test-child"/>
      </AppContent>
    );

    expect(tree.everySubTree('MviRecordsUnavailable')).not.to.be.empty;
    expect(tree.everySubTree('ClaimsUnauthorized')).to.be.empty;
  });
  it('should render unavailable', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent authorized>
        <div className="test-child"/>
      </AppContent>
    );

    expect(tree.everySubTree('.test-child')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnavailable')).not.to.be.empty;
  });
  it('should render unauthorized', () => {
    const tree = SkinDeep.shallowRender(
      <AppContent>
        <div className="test-child"/>
      </AppContent>
    );
    expect(tree.everySubTree('.test-child')).to.be.empty;
    expect(tree.everySubTree('ClaimsUnauthorized')).not.to.be.empty;
  });
});
