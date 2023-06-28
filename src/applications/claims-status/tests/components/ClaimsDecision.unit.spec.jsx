import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimsDecision from '../../components/ClaimsDecision';

describe('<ClaimsDecision>', () => {
  it('should render message without date sentence', () => {
    const date = null;
    const tree = SkinDeep.shallowRender(
      <ClaimsDecision completedDate={date} />,
    );

    expect(tree.text()).not.to.contain('We decided your claim on');
  });
  it('should render message with date sentence', () => {
    const date = '2010-03-01';
    const tree = SkinDeep.shallowRender(
      <ClaimsDecision completedDate={date} />,
    );

    expect(tree.text()).to.contain('We decided your claim on March 1, 2010');
  });
});
