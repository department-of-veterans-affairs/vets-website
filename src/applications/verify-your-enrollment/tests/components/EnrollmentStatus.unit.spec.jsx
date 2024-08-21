import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { EnrollmentStatus } from '../../components/EnrollmentStatus';

describe('<EnrollmentStatus/>', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<EnrollmentStatus />);
    expect(wrapper).to.be.not.null;
    wrapper.unmount();
  });
  it('Should render You currently have no enrollments. text if user is not part of vye', () => {
    const wrapper = shallow(<EnrollmentStatus dontHaveEnrollment />);
    expect(
      wrapper
        .find('span')
        .at(0)
        .text(),
    ).to.equal('You currently have no enrollments.');
    wrapper.unmount();
  });
});
