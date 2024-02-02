import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ExpandingGroup from '../components/ExpandingGroup';

describe('<ExpandingGroup>', () => {
  it('renders only first child when open is false', () => {
    const wrapper = shallow(
      <ExpandingGroup open={false}>
        <div className="first" />
        <div className="second" />
      </ExpandingGroup>,
    );

    const first = wrapper.find('.first');
    const second = wrapper.find('.second');
    expect(first).to.have.lengthOf(1);
    expect(second).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders both children when open is true', () => {
    const wrapper = shallow(
      <ExpandingGroup open>
        <div className="first" />
        <div className="second" />
      </ExpandingGroup>,
    );

    const first = wrapper.find('.first');
    const second = wrapper.find('.second');
    expect(first).to.have.lengthOf(1);
    expect(second).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
