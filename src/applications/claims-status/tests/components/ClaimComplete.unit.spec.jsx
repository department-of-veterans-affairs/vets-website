import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimComplete from '../../components/ClaimComplete';

describe('<ClaimComplete>', () => {
  it('should render message', () => {
    const date = '2010-09-01';
    const tree = SkinDeep.shallowRender(<ClaimComplete completedDate={date} />);

    expect(tree.text()).to.contain(
      'We decided your claim on September 1, 2010',
    );
    expect(tree.everySubTree('CompleteDetails')).to.not.be.false;
  });
});
