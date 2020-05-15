import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { EducationGate } from '../../../0994/containers/EducationGate';
import backendServices from 'platform/user/profile/constants/backendServices';

const user = {
  login: {
    currentlyLoggedIn: true,
  },
  profile: {
    services: [backendServices.EDUCATION_BENEFITS],
  },
};

const location = {
  pathname: '/notIntroduction',
};

describe('Edu 0994 <ConfirmationPage>', () => {
  it('should render RequiredLoginView', () => {
    const tree = shallow(<EducationGate user={user} location={location} />);

    expect(tree.text()).to.contain('RequiredLoginView');

    tree.unmount();
  });

  it('should render AlertBox', () => {
    const missingInfoUser = {
      ...user,
      profile: {
        ...user.profile,
        services: [],
      },
    };
    const tree = shallow(
      <EducationGate user={missingInfoUser} location={location} />,
    );

    expect(tree.text()).to.contain('AlertBox');

    tree.unmount();
  });

  it('should render Children', () => {
    const introLocation = {
      pathname: '/introduction',
    };
    const tree = shallow(
      <EducationGate user={user} location={introLocation} />,
    );

    expect(tree.text()).to.not.contain('AlertBox');
    expect(tree.text()).to.not.contain('RequiredLoginView');

    tree.unmount();
  });
});
