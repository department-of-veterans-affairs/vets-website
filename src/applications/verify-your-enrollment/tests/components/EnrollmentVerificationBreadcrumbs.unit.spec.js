import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EnrollmentVerificationBreadcrumbs from '../../components/EnrollmentVerificationBreadcrumbs';

describe('<EnrollmentVerificationBreadcrumbs>', () => {
  it('renders breadcrumbs correctly', () => {
    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);

    // Expect the component to have a 'va-breadcrumbs' element
    expect(wrapper.find('va-breadcrumbs').length).to.equal(1);

    wrapper.unmount();
  });
});
