import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LicenseCertificationSearchForm from '../../components/LicenseCertificationSearchForm';

describe('<LicenseCertificationSearchForm />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<LicenseCertificationSearchForm />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
