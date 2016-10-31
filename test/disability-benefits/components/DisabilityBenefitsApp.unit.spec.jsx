import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DisabilityBenefitsApp } from '../../../src/js/disability-benefits/containers/DisabilityBenefitsApp';

describe('<DisabilityBenefitsApp>', () => {
  it('should render children', () => {
    const tree = SkinDeep.shallowRender(
      <DisabilityBenefitsApp
          available
          synced>
        <div className="test-child"/>
      </DisabilityBenefitsApp>
    );
    const view = SkinDeep.shallowRender(tree.props.component);
    expect(view.everySubTree('.test-child')).not.to.be.empty;
    expect(view.everySubTree('ClaimSyncWarning')).to.be.empty;
    expect(view.everySubTree('ClaimsUnavailable')).to.be.empty;
  });
  it('should render sync warning', () => {
    const tree = SkinDeep.shallowRender(
      <DisabilityBenefitsApp
          available>
        <div className="test-child"/>
      </DisabilityBenefitsApp>
    );
    const view = SkinDeep.shallowRender(tree.props.component);
    expect(view.everySubTree('.test-child')).not.to.be.empty;
    expect(view.everySubTree('ClaimSyncWarning')).not.to.be.empty;
    expect(view.everySubTree('ClaimsUnavailable')).to.be.empty;
  });
  it('should render unavailable', () => {
    const tree = SkinDeep.shallowRender(
      <DisabilityBenefitsApp>
        <div className="test-child"/>
      </DisabilityBenefitsApp>
    );
    const view = SkinDeep.shallowRender(tree.props.component);
    expect(view.everySubTree('.test-child')).to.be.empty;
    expect(view.everySubTree('ClaimSyncWarning')).to.be.empty;
    expect(view.everySubTree('ClaimsUnavailable')).not.to.be.empty;
  });
});
