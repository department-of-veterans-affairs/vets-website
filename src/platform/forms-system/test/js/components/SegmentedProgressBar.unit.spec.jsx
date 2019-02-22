import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { axeCheck } from '../../config/helpers';

import SegmentedProgressBar from '../../../src/js/components/SegmentedProgressBar.jsx';

describe('<SegmentedProgressBar/>', () => {
  it('should render', () => {
    const tree = shallow(<SegmentedProgressBar current={2} total={5}/>);
    expect(tree.find('.progress-segment')).to.have.length(5);
    expect(tree.find('.progress-segment-complete').length).to.equal(2);
  });

  it('should pass aXe check', () => {
    return axeCheck(<SegmentedProgressBar current={2} total={5}/>);
  });
});
