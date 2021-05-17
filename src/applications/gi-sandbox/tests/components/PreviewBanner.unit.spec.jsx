import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import PreviewBanner from '../../components/PreviewBanner';

describe('<PreviewBanner>', () => {
  it('should render', () => {
    const wrapper = shallow(<PreviewBanner />);
    expect(wrapper.find('.gi-preview-banner').length).to.eq(1);
    wrapper.unmount();
  });
});
