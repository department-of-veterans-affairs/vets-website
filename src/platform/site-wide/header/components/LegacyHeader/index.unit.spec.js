// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { LegacyHeader } from '.';

describe('Header <LegacyHeader>', () => {
  it('renders content', () => {
    const wrapper = shallow(<LegacyHeader showMegaMenu showNavLogin />);
    expect(wrapper.find('.incompatible-browser-warning')).to.have.lengthOf(1);
    expect(wrapper.find('.va-notice--banner')).to.have.lengthOf(1);
    expect(
      wrapper.find('.usa-banner-content.usa-grid.usa-accordion-content'),
    ).to.have.lengthOf(1);
    expect(
      wrapper.find('.usa-banner-guidance-ssl.usa-width-one-half'),
    ).to.have.lengthOf(1);
    expect(wrapper.find('.va-crisis-line-container')).to.have.lengthOf(1);
    expect(wrapper.find('#va-header-logo-menu')).to.have.lengthOf(1);
    expect(wrapper.find('.va-header-logo-wrapper')).to.have.lengthOf(1);
    expect(wrapper.find('#va-nav-controls')).to.have.lengthOf(1);
    expect(wrapper.find('#mega-menu-mobile')).to.have.lengthOf(1);
    expect(wrapper.find('#login-root')).to.have.lengthOf(1);
    expect(wrapper.find('#mega-menu')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
