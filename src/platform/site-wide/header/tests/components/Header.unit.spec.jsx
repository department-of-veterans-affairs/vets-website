import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Header from '../../components/Header';

describe('Header <Header>', () => {
  const renderHeader = () => shallow(<Header showMegaMenu showNavLogin />);
  let wrapper;

  beforeEach(() => {
    wrapper = renderHeader();
  });

  it('renders content', () => {
    expect(wrapper.find('OfficialGovtWebsite')).to.have.lengthOf(1);
    expect(wrapper.find('ForwardRef(VaCrisisLineModal)')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(LogoRow)')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(Menu)')).to.have.lengthOf(1);
  });
});
