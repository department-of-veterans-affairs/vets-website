import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { axeCheck } from '../../config/helpers';
import ExpandingGroup from '../../../src/js/components/ExpandingGroup.jsx';

describe('<ExpandingGroup>', () => {
  it('renders only first child when open is false', () => {
    const wrapper = shallow(
      <ExpandingGroup open={false}>
        <first />
        <second />
      </ExpandingGroup>,
    );

    const first = wrapper.find('first');
    const second = wrapper.find('second');
    expect(first).to.have.lengthOf(1);
    expect(second).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders both children when open is true', () => {
    const wrapper = shallow(
      <ExpandingGroup open>
        <first />
        <second />
      </ExpandingGroup>,
    );

    const first = wrapper.find('first');
    const second = wrapper.find('second');
    expect(first).to.have.lengthOf(1);
    expect(second).to.have.lengthOf(1);
    wrapper.unmount();
  });

  // this will be skipped until axeCheck can be rewritten TODO: @asg5704
  it.skip('passes aXe check when only first child is rendered', () =>
    axeCheck(
      <ExpandingGroup open={false}>
        <first />
        <second />
      </ExpandingGroup>,
    ));

  // this will be skipped until axeCheck can be rewritten TODO: @asg5704
  it.skip('passes aXe check when both children are rendered', () =>
    axeCheck(
      <ExpandingGroup open>
        <first />
        <second />
      </ExpandingGroup>,
    ));
});
