import React from 'react';
import SD from 'skin-deep';
import { expect } from 'chai';

import CurrentStatus from '../../../../src/js/claims-status/components/appeals-v2/CurrentStatus';

const defaultProps = {
  title: '',
  description: ''
};

describe('<CurrentStatus/>', () => {
  it('should render', () => {
    const tree = SD.shallowRender(<CurrentStatus {...defaultProps}/>);
    expect(tree.type).to.equal('div');
  });
});
