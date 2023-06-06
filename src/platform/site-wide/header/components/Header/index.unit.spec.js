// 3rd-party imports
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

// 1st-party imports
import { Header } from '.';

describe('Header <Header>', () => {
  const renderHeader = () => shallow(<Header showMegaMenu showNavLogin />);

  // Component Wrapper
  let wrapper;

  beforeEach(() => {
    // Set up.
    wrapper = renderHeader();
  });

  it('renders content', () => {
    // Assertions.
    expect(wrapper.find('OfficialGovtWebsite')).to.have.lengthOf(1);
    expect(wrapper.find('VeteranCrisisLine')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(LogoRow)')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(Menu)')).to.have.lengthOf(1);
  });
});
