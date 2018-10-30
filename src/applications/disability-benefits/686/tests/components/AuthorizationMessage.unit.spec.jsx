import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import AuthorizationMessage from '../../components/AuthorizationMessage';
import { profileStatuses } from '../../helpers';

const { SERVER_ERROR, NOT_FOUND } = profileStatuses;

describe('686 <AuthorizationMessage>', () => {
  it('should render SERVER_ERROR profile status error message', () => {
    const user = {
      profileStatus: SERVER_ERROR,
      isLoggedIn: true,
    };

    const tree = mount(<AuthorizationMessage user={user} />);

    expect(tree.find('SystemDownView').text()).to.contain(
      'Sorry, our system is temporarily down while we fix a few things. Please try again later.Go Back to Vets.gov',
    );
  });

  it('should render NOT_FOUND profile status error message', () => {
    const user = {
      profileStatus: NOT_FOUND,
      isLoggedIn: true,
    };

    const tree = mount(<AuthorizationMessage user={user} />);

    expect(tree.find('SystemDownView').text()).to.contain(
      'We couldn’t find your records with that information.',
    );
  });

  it('should render unverified error message', () => {
    const user = {
      isVerified: false,
      isLoggedIn: true,
    };

    const tree = shallow(<AuthorizationMessage user={user} />);

    expect(tree.text()).to.contain('We couldn’t verify your identity');
  });

  it('should render 30 percent disability rating error message', () => {
    const user = {
      isVerified: true,
      isLoggedIn: true,
    };

    const tree = shallow(
      <AuthorizationMessage has30PercentDisabilityRating={false} user={user} />,
    );

    expect(tree.text()).to.contain(
      'You won’t be able to add a dependent at this timeWe’re sorry. You need to have a disability rating of at least 30% to add a dependent to your benefits. Our records show that your current rating is less than 30%, so you can’t apply at this time. If you think our records aren’t correct, please call Veterans Benefits Assistance at 1-800-827-1000. We’re here Monday – Friday, 8:00 a.m. to 9:00 p.m. (ET).Start a Claim for Increase Application',
    );
  });
});
