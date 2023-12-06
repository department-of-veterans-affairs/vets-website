import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EnrollmentVerificationBreadcrumbs from '../../components/EnrollmentVerificationBreadcrumbs';
import { BASE_URL } from '../../constants/index';

describe('<EnrollmentVerificationBreadcrumbs>', () => {
  it('renders breadcrumbs correctly', () => {
    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);

    // Expect the component to have a 'va-breadcrumbs' element
    expect(wrapper.find('va-breadcrumbs').length).to.equal(1);

    // Check if the breadcrumbs are rendered
    const breadcrumbs = wrapper.find('va-breadcrumbs').children();
    expect(breadcrumbs.length).to.equal(3); // There should be 3 breadcrumb links

    // Check for specific breadcrumb links
    expect(breadcrumbs.at(0).props().href).to.equal('/');
    expect(breadcrumbs.at(1).props().href).to.equal('/education/');
    expect(breadcrumbs.at(2).props().href).to.equal(BASE_URL);

    // Check the breadcrumb texts
    expect(breadcrumbs.at(0).text()).to.equal('Home');
    expect(breadcrumbs.at(1).text()).to.equal('Education and training');
    expect(breadcrumbs.at(2).text()).to.include(
      'Verify your school enrollments for',
    );

    wrapper.unmount();
  });
});
