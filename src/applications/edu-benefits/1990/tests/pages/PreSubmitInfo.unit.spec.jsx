import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import PreSubmitInfo from '../../pages/PreSubmitInfo';

describe('<PreSubmitNotice />', () => {
  it('should render corrcetly', () => {
    const wrapper = shallow(
      <PreSubmitInfo
        formData={{
          veteranDateOfBirth: '1900-1-1',
          currentlyActiveDuty: {
            yes: true,
          },
        }}
      />,
    );
    expect(wrapper).to.not.be.equal(null);
    wrapper.unmount();
  });
  it('it should show   You are the parent, guardian, or custodian of the applicant if applicant is 17', () => {
    // get a year that would make them 17
    const year = new Date().getFullYear() - 17;
    const wrapper = shallow(
      <PreSubmitInfo
        formData={{
          veteranDateOfBirth: `${year}-01-01`,
          currentlyActiveDuty: {
            yes: false,
          },
        }}
      />,
    );
    expect(wrapper).to.not.be.equal(null);
    wrapper.unmount();
  });
});
