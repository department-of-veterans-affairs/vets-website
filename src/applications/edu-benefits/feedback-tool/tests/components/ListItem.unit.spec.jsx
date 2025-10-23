import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ListItem from '../../components/ListItem';

describe('<ListItem/>', () => {
  const item = { content: [{ type: 'phone', value: '000-000-0000' }] };
  it('should render without issue', () => {
    const wrapper = shallow(<ListItem item={item} />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('should render phone', () => {
    const wrapper = shallow(<ListItem item={item} />);
    const phone = wrapper.find('va-telephone');
    expect(phone).to.exist;
    wrapper.unmount();
  });
});
