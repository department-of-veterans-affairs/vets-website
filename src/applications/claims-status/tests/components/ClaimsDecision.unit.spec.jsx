import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimsDecision from '../../components/ClaimsDecision';

describe('<ClaimsDecision>', () => {
  it('should render message without date sentence', () => {
    const date = null;
    const eBenefitsUrl = path => path;
    const tree = SkinDeep.shallowRender(
      <ClaimsDecision completedDate={date} eBenefitsUrl={eBenefitsUrl} />,
    );

    expect(tree.text()).not.to.contain('We finished reviewing your claim');
  });
  it('should render message with date sentence', () => {
    const date = '2010-03-01';
    const eBenefitsUrl = path => path;
    const tree = SkinDeep.shallowRender(
      <ClaimsDecision completedDate={date} eBenefitsUrl={eBenefitsUrl} />,
    );

    expect(tree.text()).to.contain('We finished reviewing your claim');
    expect(tree.text()).to.contain('March 1, 2010');
  });
});
