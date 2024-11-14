import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LicenseCertificationSearchForm from '../../components/LicenseCertificationSearchForm';

describe('<LicenseCertificationSearchForm />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LicenseCertificationSearchForm />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render without crashing', () => {
    expect(wrapper.exists()).to.be.ok;
  });
});
