import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LicenseCertificationResultInfo from '../../components/LicenseCertificationResultInfo';

describe('<LicenseCertificaResultInfo />', () => {
  it('should render without crashing', () => {
    const resultInfo = {
      institution: {
        name: 'Sample Institution',
        phone: '123-456-7890',
        physicalStreet: '123 Main St',
        physicalCity: 'Sample City',
        physicalState: 'CA',
        physicalZip: '90210',
        physicalCountry: 'USA',
      },
      tests: [
        { name: 'Sample Test 1', fee: 200 },
        { name: 'Sample Test 2', fee: 300 },
      ],
    };

    const wrapper = shallow(
      <LicenseCertificationResultInfo resultInfo={resultInfo} />,
    );
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
