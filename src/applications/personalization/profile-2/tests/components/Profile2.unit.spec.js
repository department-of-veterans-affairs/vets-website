import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Profile2 from '../../components/Profile2Wrapper';
import getRoutes from '../../routes';

describe('Profile2', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      location: {
        pathname: '/profile/personal-information',
      },
      routes: getRoutes(),
    };
  });

  it('should render BreadCrumbs', () => {
    const wrapper = shallow(<Profile2 {...defaultProps} />);
    expect(wrapper.find('Breadcrumbs')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render the correct breadcrumb (Personal and contact Information)', () => {
    const wrapper = shallow(<Profile2 {...defaultProps} />);
    const BreadCrumbs = wrapper.find('Breadcrumbs');
    const activeRouteText = BreadCrumbs.find('a')
      .last()
      .text();

    expect(activeRouteText.toLowerCase()).to.include(
      'personal and contact information',
    );
    wrapper.unmount();
  });
});
