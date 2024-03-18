import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PageLink from '../../components/PageLink';

describe('<PageLink/>', () => {
  it('should render without issue', () => {
    const wrapper = shallow(<PageLink />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
