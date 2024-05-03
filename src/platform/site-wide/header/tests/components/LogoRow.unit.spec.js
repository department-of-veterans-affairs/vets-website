import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { LogoRow } from '../../components/LogoRow';

describe('Header <LogoRow>', () => {
  it('renders correct content with no props', () => {
    const wrapper = shallow(<LogoRow />);

    expect(wrapper.find('Logo')).to.have.length(1);
    expect(wrapper.find('Connect(Main)')).to.have.length(1);
    expect(wrapper.find('button.header-menu-button')).to.have.length(1);
    expect(wrapper.text()).includes('Menu');
    expect(wrapper.text()).not.includes('Close');
    expect(wrapper.find('div.header-menu-button-overlay')).to.have.length(0);

    wrapper.unmount();
  });

  it('renders correct content with isMenuOpen', () => {
    const wrapper = shallow(<LogoRow isMenuOpen />);

    expect(wrapper.find('Logo')).to.have.length(1);
    expect(wrapper.find('Connect(Main)')).to.have.length(1);
    expect(wrapper.find('button.header-menu-button')).to.have.length(1);
    expect(wrapper.text()).includes('Close');
    expect(wrapper.text()).not.includes('Menu');
    expect(wrapper.find('div.header-menu-button-overlay')).to.have.length(1);

    wrapper.unmount();
  });

  it('toggles the menu', () => {
    const updateExpandedMenuID = sinon.spy();
    const setIsMenuOpen = sinon.spy();
    const wrapper = shallow(
      <LogoRow
        isMenuOpen
        updateExpandedMenuID={updateExpandedMenuID}
        setIsMenuOpen={setIsMenuOpen}
      />,
    );

    wrapper.find('.header-menu-button').simulate('click');

    expect(updateExpandedMenuID.called).to.be.true;
    expect(setIsMenuOpen.called).to.be.true;
    expect(setIsMenuOpen.firstCall.args[0]).to.equal(false);

    wrapper.unmount();
  });
});
