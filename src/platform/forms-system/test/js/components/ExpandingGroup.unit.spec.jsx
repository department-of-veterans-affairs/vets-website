import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { renderComponentForA11y } from 'platform/user/tests/helpers';
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

  it('passes aXe check when only first child is rendered', async () => {
    await expect(
      renderComponentForA11y(
        <ExpandingGroup open={false}>
          <first />
          <second />
        </ExpandingGroup>,
      ),
    ).to.be.accessible();
  });

  it('passes aXe check when both children are rendered', async () => {
    await expect(
      renderComponentForA11y(
        <ExpandingGroup open>
          <first />
          <second />
        </ExpandingGroup>,
      ),
    ).to.be.accessible();
  });
});
