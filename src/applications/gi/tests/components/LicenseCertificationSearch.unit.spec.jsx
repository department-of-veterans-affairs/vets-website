import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LicenseCertificationSearch from '../../components/LicenseCertificationSearch';

describe('<LicenseCertificationSearch />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<LicenseCertificationSearch />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
