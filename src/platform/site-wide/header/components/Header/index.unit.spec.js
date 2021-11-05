// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Header } from '.';

describe('Header <Header>', () => {
  it('renders content', () => {
    // Set up.
    const wrapper = shallow(<Header showMegaMenu showNavLogin />);

    // Assertions.
    expect(wrapper.find('OfficialGovtWebsite')).to.have.lengthOf(1);
    expect(wrapper.find('VeteranCrisisLine')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(LogoRow)')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(Menu)')).to.have.lengthOf(1);

    // Clean up.
    wrapper.unmount();
  });
});
