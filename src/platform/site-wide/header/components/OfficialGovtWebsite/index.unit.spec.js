// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { OfficialGovtWebsite } from '.';

describe('Header <OfficialGovtWebsite>', () => {
  it('renders content', () => {
    // Set up.
    const wrapper = shallow(<OfficialGovtWebsite />);

    // Assertions.
    expect(wrapper.text()).includes(
      'An official website of the United States government.',
    );
    expect(wrapper.find('.header-us-flag')).to.have.length(1);
    expect(wrapper.find('.header-us-flag')).to.have.length(1);
    expect(wrapper.find('.expand-official-govt-explanation')).to.have.length(1);
    expect(wrapper.find('.fa.fa-chevron-down')).to.have.length(1);
    expect(wrapper.find('#official-govt-site-explanation')).to.have.length(0);
    expect(wrapper.text()).not.includes('The .gov means it’s official.');
    expect(wrapper.text()).not.includes('The site is secure.');

    // Set up.
    wrapper.find('.expand-official-govt-explanation').simulate('mouseup');

    // Assertions.
    expect(wrapper.find('#official-govt-site-explanation')).to.have.length(1);
    expect(wrapper.text()).includes('The .gov means it’s official.');
    expect(wrapper.text()).includes('The site is secure.');

    // Clean up.
    wrapper.unmount();
  });
});
