/* eslint-disable @department-of-veterans-affairs/enzyme-unmount */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CustomPersonalInfoReview from '../../../components/CustomPersonalInfoReview';

describe('CustomPersonalInfoReview shallow render', () => {
  it('should render the PersonalInformationReview wrapper', () => {
    const wrapper = shallow(
      <CustomPersonalInfoReview
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    expect(wrapper.find('PersonalInformationReview')).to.have.lengthOf(1);
  });

  it('should pass the correct title prop', () => {
    const wrapper = shallow(
      <CustomPersonalInfoReview
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    expect(wrapper.props().title).to.equal('Personal information');
  });

  it('should pass the correct dataAdapter prop', () => {
    const wrapper = shallow(
      <CustomPersonalInfoReview
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    expect(wrapper.props().dataAdapter).to.deep.equal({
      ssnPath: 'veteranSsnLastFour',
      vaFileNumberPath: 'vaFileNumberLastFour',
    });
  });

  it('should pass the correct config prop', () => {
    const wrapper = shallow(
      <CustomPersonalInfoReview
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    expect(wrapper.props().config).to.deep.equal({
      name: { show: true },
      ssn: { show: true },
      vaFileNumber: { show: true },
      dateOfBirth: { show: false },
    });
  });
});
