/* eslint-disable @department-of-veterans-affairs/enzyme-unmount */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CustomPersonalInfo from '../../../components/CustomPersonalInfo';

describe('CustomPersonalInfo shallow render', () => {
  it('should render the PersonalInformation wrapper', () => {
    const wrapper = shallow(
      <CustomPersonalInfo
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    expect(wrapper.find('PersonalInformation')).to.have.lengthOf(1);
  });

  it('should include a PersonalInformationHeader as child', () => {
    const wrapper = shallow(
      <CustomPersonalInfo
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    const header = wrapper.find('PersonalInformationHeader');
    expect(header).to.have.lengthOf(1);
  });

  it('should pass dataAdapter prop correctly', () => {
    const wrapper = shallow(
      <CustomPersonalInfo
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    expect(wrapper.props().dataAdapter).to.deep.equal({
      ssnPath: 'veteranSocialSecurityNumber',
      vaFileNumberPath: 'vaFileNumber',
    });
  });

  it('should pass required fields in config prop', () => {
    const wrapper = shallow(
      <CustomPersonalInfo
        data={{
          veteranSocialSecurityNumber: '1234',
          vaFileNumber: '5678',
        }}
      />,
    );

    expect(wrapper.props().config.name).to.deep.equal({
      show: true,
      required: true,
    });
  });
});
