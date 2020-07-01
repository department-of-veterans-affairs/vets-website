import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimComplete from '../../components/ClaimComplete';

describe('<ClaimComplete>', () => {
  it('should render message', () => {
    const date = '2010-03-01';
    const tree = SkinDeep.shallowRender(<ClaimComplete completedDate={date} />);

    const text = tree.text();
    expect(text).to.contain('Your claim was closed on March 1, 2010');
    expect(text).to.contain('expect to receive payment');
  });
});
