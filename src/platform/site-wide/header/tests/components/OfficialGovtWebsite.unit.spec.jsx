import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { OfficialGovtWebsite } from '../../components/OfficialGovtWebsite';

describe('Header <OfficialGovtWebsite>', () => {
  it('renders content', () => {
    const wrapper = shallow(<OfficialGovtWebsite />);

    expect(wrapper.text()).includes(
      'An official website of the United States government.',
    );
    expect(wrapper.find('.header-us-flag')).to.have.length(1);
    expect(wrapper.find('.header-us-flag')).to.have.length(1);
    expect(wrapper.find('.expand-official-govt-explanation')).to.have.length(1);
    expect(wrapper.find('#official-govt-site-explanation')).to.have.length(0);
    expect(wrapper.text()).not.includes('The .gov means it’s official.');
    expect(wrapper.text()).not.includes('The site is secure.');

    wrapper.find('.expand-official-govt-explanation').simulate('click');

    expect(wrapper.find('#official-govt-site-explanation')).to.have.length(1);
    expect(wrapper.text()).includes('The .gov means it’s official.');
    expect(wrapper.text()).includes('The site is secure.');

    wrapper.unmount();
  });
});
