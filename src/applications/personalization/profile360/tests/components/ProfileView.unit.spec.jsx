import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import { ProfileView } from '../../components/ProfileView';

describe('<ProfileView/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      user: {
        profile: {
          verified: true,
          status: 'OK',
        },
      },
      profile: {},
      downtimeData: {},
      message: {},
      directDepositIsBlocked: false,
    };
  });

  it('should render the profile when the user is verified and status OK', () => {
    const wrapper = enzyme.shallow(<ProfileView {...props} />);
    expect(wrapper.find('Hero')).to.have.lengthOf(1);
    expect(wrapper.find('ContactInformation')).to.have.lengthOf(1);
    expect(wrapper.find('PersonalInformation')).to.have.lengthOf(1);
    expect(wrapper.find('MilitaryInformation')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render BreadCrumbs', () => {
    const wrapper = enzyme.shallow(<ProfileView {...props} />);
    expect(wrapper.find('Breadcrumbs')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should prompt to increase LOA when a user is not verified', () => {
    props.user.profile.verified = false;
    const wrapper = enzyme.shallow(<ProfileView {...props} />);
    expect(wrapper.find('IdentityVerification')).to.have.lengthOf(1);
    expect(wrapper.find('Hero')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should show an MVI error when status is not OK', () => {
    props.user.profile.status = 'NOT_FOUND';
    const wrapper = enzyme.shallow(<ProfileView {...props} />);
    expect(wrapper.find('MVIError')).to.have.lengthOf(1);
    expect(wrapper.find('Hero')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  describe('Blocked from Direct Deposit alert', () => {
    it('should not be shown when `directDepositIsBlocked` is not `true`', () => {
      const wrapper = enzyme.shallow(<ProfileView {...props} />);
      expect(wrapper.find('PaymentInformationBlocked')).to.have.lengthOf(0);
      expect(wrapper.find('Hero')).to.have.lengthOf(1);
      wrapper.unmount();
    });
    it('should be shown when `directDepositIsBlocked` is `true`', () => {
      props.directDepositIsBlocked = true;
      const wrapper = enzyme.shallow(<ProfileView {...props} />);
      expect(wrapper.find('PaymentInformationBlocked')).to.have.lengthOf(1);
      expect(wrapper.find('Hero')).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });
});
