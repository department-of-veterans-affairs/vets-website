import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EnrollmentVerificationBreadcrumbs from '../../components/EnrollmentVerificationBreadcrumbs';
import {
  BASE_URL,
  BENEFITS_PROFILE_URL,
  BENEFITS_PROFILE_URL_SEGMENT,
} from '../../constants/index';

describe('<EnrollmentVerificationBreadcrumbs>', () => {
  it('renders breadcrumbs correctly', () => {
    // Mock window location
    delete window.location;
    window.location = new URL(
      `http://localhost/${BENEFITS_PROFILE_URL_SEGMENT}`,
    );

    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);

    // Expect the component to have a 'va-breadcrumbs' element
    expect(wrapper.find('va-breadcrumbs').length).to.equal(1);

    // Check if the breadcrumbs are rendered
    const breadcrumbs = wrapper.find('va-breadcrumbs').children();
    expect(breadcrumbs.length).to.equal(4); // Expect 4 breadcrumb links when on BENEFITS_PROFILE_URL_SEGMENT

    // Check for specific breadcrumb links
    expect(breadcrumbs.at(0).props().href).to.equal('/');
    expect(breadcrumbs.at(1).props().href).to.equal('/education/');
    expect(breadcrumbs.at(2).props().href).to.equal(BASE_URL);
    expect(breadcrumbs.at(3).props().href).to.equal(BENEFITS_PROFILE_URL);

    // Check the breadcrumb texts
    expect(breadcrumbs.at(0).text()).to.equal('Home');
    expect(breadcrumbs.at(1).text()).to.equal('Education and training');
    expect(breadcrumbs.at(2).text()).to.equal(
      'GI Bill® enrollment verifications',
    );
    expect(breadcrumbs.at(3).text()).to.equal('Benefits profile');

    wrapper.unmount();

    // Restore the original window.location
    delete window.location;
    window.location = location;
  });
  it('does not include "Benefits profile" breadcrumb for other pages', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    });
    window.location.href = 'http://example.com/other-page';

    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);
    expect(
      wrapper.find('a').someWhere(n => n.prop('href') === BENEFITS_PROFILE_URL),
    ).to.equal(false);
    wrapper.unmount();
  });
});
