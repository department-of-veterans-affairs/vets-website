import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EnrollmentVerificationBreadcrumbs from '../../components/EnrollmentVerificationBreadcrumbs';
import {
  BASE_URL,
  BENEFITS_PROFILE_URL,
  BENEFITS_PROFILE_URL_SEGMENT,
  VERIFICATION_PROFILE_URL,
  VERIFICATION_REVIEW_URL_SEGMENT,
} from '../../constants/index';

describe('<EnrollmentVerificationBreadcrumbs>', () => {
  const defaultUrls = [
    { href: '/', label: 'Home' },
    { href: '/education/', label: 'Education and training' },
    {
      href: '/education/verify-school-enrollment/',
      label: 'Verify your school enrollment for GI Bill benefits',
    },
    { href: BASE_URL, label: 'Montgomery GI Bill enrollment verification' },
  ];

  it('renders breadcrumbs correctly', () => {
    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);

    // Expect the component to have a 'va-breadcrumbs' element
    expect(wrapper.find('va-breadcrumbs').length).to.equal(1);
    wrapper.unmount();
  });

  it('should renders default breadcrumbs', () => {
    window.location.href = `${BASE_URL}/`;

    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);
    const breadcrumbs = wrapper.find('va-breadcrumbs').prop('breadcrumb-list');

    expect(breadcrumbs).to.deep.equal(defaultUrls);
    wrapper.unmount();
  });

  it('should not include "Your Benefits profile" breadcrumb for other pages', () => {
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

  it('should renders breadcrumbs with benefits profile', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    });
    window.location.href = `${BASE_URL}/${BENEFITS_PROFILE_URL_SEGMENT}/`;

    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);
    const breadcrumbs = wrapper
      .find('[label="Breadcrumb"]')
      .prop('breadcrumbList');

    expect(breadcrumbs).to.deep.equal([
      ...defaultUrls,
      {
        href: BENEFITS_PROFILE_URL,
        label: 'Your Montgomery GI Bill benefits information',
      },
    ]);
    wrapper.unmount();
  });

  it('renders breadcrumbs with verification review', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    });
    window.location.href = `${BASE_URL}/${VERIFICATION_REVIEW_URL_SEGMENT}`;

    const wrapper = shallow(<EnrollmentVerificationBreadcrumbs />);
    const breadcrumbs = wrapper
      .find('[label="Breadcrumb"]')
      .prop('breadcrumbList');

    expect(breadcrumbs).to.deep.equal([
      ...defaultUrls,
      { href: VERIFICATION_PROFILE_URL, label: 'Verify your enrollment' },
    ]);
    wrapper.unmount();
  });
});
