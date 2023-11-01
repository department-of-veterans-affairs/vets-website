import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import backendServices from 'platform/user/profile/constants/backendServices';
import { EducationGate } from '../../../containers/EducationGate';

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

  it('should render the proper alert text', () => {
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

    expect(tree.text()).to.contain(
      'We’re sorry. It looks like we’re missing some information needed for your applicationFor help with your application, please call Veterans Benefits Assistance at 800-827-1000, Monday – Friday, 8:00 a.m. to 9:00 p.m. ET.',
    );

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
