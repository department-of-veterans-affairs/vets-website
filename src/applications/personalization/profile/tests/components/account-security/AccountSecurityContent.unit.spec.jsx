import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import {
  AccountSecurityContent,
  mapStateToProps,
} from '@@profile/components/account-security/AccountSecurityContent';
import ProfileInfoTable from '@@profile/components/ProfileInfoTable';
import IdentityNotVerified from '~/applications/personalization/components/IdentityNotVerified';
import TwoFactorAuthorizationStatus from '@@profile/components/account-security/TwoFactorAuthorizationStatus';
import MHVTermsAndConditionsStatus from '@@profile/components/account-security/MHVTermsAndConditionsStatus';
import EmailAddressNotification from '@@profile/components/personal-information/email-addresses/EmailAddressNotification';
import Verified from '@@profile/components/account-security/Verified';

describe('AccountSecurityContent', () => {
  let wrapper;
  const makeDefaultProps = () => ({
    isIdentityVerified: true,
    isMultifactorEnabled: true,
    mhvAccount: { termsAndConditionsAccepted: true },
    showMHVTermsAndConditions: true,
    useSSOe: true,
    showWeHaveVerifiedYourID: true,
  });

  it('should render a ProfileInfoTable as its first child', () => {
    wrapper = shallow(<AccountSecurityContent {...makeDefaultProps()} />);
    expect(wrapper.childAt(0).type()).to.equal(ProfileInfoTable);
    wrapper.unmount();
  });

  it('should render IdentityNotVerified as its first child when isIdentityVerified is false', () => {
    const props = makeDefaultProps();
    props.isIdentityVerified = false;
    wrapper = shallow(<AccountSecurityContent {...props} />);
    expect(wrapper.childAt(0).type()).to.equal(IdentityNotVerified);
    wrapper.unmount();
  });

  describe('child ProfileInfoTable', () => {
    let infoTableData;
    let props;

    describe('when `showMHVTermsAndConditions` is `true`', () => {
      beforeEach(() => {
        props = makeDefaultProps();
        wrapper = shallow(<AccountSecurityContent {...props} />);
        infoTableData = wrapper.find('ProfileInfoTable').prop('data');
      });
      afterEach(() => {
        wrapper.unmount();
      });
      it('should pass in four rows of data', () => {
        expect(infoTableData.length).to.equal(4);
      });
      it('should have the correct row titles', () => {
        const expectedTitles = [
          'Identity verification',
          '2-factor authentication',
          'Terms and conditions',
          'Sign-in email address',
        ];
        infoTableData.forEach((row, rowIndex) => {
          expect(row.title).to.equal(expectedTitles[rowIndex]);
        });
      });
      it('should render "Verified" in the first row when isIdentityVerified is true', () => {
        const firstRowComponent = infoTableData[0].value;
        expect(firstRowComponent.type).to.equal(Verified);
      });
      it('should pass the `isMultifactorEnabled` prop to the `TwoFactorAuthorizationStatus` component in the second row', () => {
        const secondRowComponent = infoTableData[1].value;
        expect(secondRowComponent.type).to.equal(TwoFactorAuthorizationStatus);
        expect(secondRowComponent.props.isMultifactorEnabled).to.equal(
          props.isMultifactorEnabled,
        );
      });
      it('should render the `EmailAddressNotification` component in the fourth row', () => {
        const secondRowComponent = infoTableData[3].value;
        expect(secondRowComponent.type).to.equal(EmailAddressNotification);
      });
      it('should pass the `mhvAccount` prop to the `MHVTermsAndConditionsStatus` component in the third row', () => {
        const thirdRowComponent = infoTableData[2].value;
        expect(thirdRowComponent.type).to.equal(MHVTermsAndConditionsStatus);
        expect(thirdRowComponent.props.mhvAccount).to.equal(props.mhvAccount);
      });
    });
    describe('when `showMHVTermsAndConditions` is `false`', () => {
      it('should pass in three rows of data', () => {
        props = makeDefaultProps();
        props.showMHVTermsAndConditions = false;
        wrapper = shallow(<AccountSecurityContent {...props} />);
        infoTableData = wrapper.find('ProfileInfoTable').prop('data');
        expect(infoTableData.length).to.equal(3);
        wrapper.unmount();
      });
    });
    describe('when `isIdentityVerified` is `false`', () => {
      it('should pass in three rows of data', () => {
        props = makeDefaultProps();
        props.isIdentityVerified = false;
        props.showWeHaveVerifiedYourID = false;
        wrapper = shallow(<AccountSecurityContent {...props} />);
        infoTableData = wrapper.find('ProfileInfoTable').prop('data');
        expect(infoTableData.length).to.equal(3);
        wrapper.unmount();
      });
    });
  });

  it('should render a properly configured AlertBox as its second child', () => {
    wrapper = shallow(<AccountSecurityContent {...makeDefaultProps()} />);
    const alertBox = wrapper.childAt(1);
    const alertBoxText = alertBox.find('p');
    const firstAlertBoxLink = alertBox.find('a').first();
    const secondAlertBoxLink = alertBox.find('a').at(1);
    const thirdAlertBoxLink = alertBox.find('a').at(2);
    const alertBoxSubtitle = alertBox.find('h4');
    expect(alertBox.type()).to.equal(AlertBox);
    expect(alertBox.prop('status')).to.equal('info');
    expect(alertBox.prop('headline')).to.equal(
      'Have questions about signing in to VA.gov?',
    );
    expect(alertBox.prop('backgroundOnly')).to.be.true;
    expect(alertBoxText.text()).to.contain('Get answers');
    expect(alertBoxSubtitle.text()).to.equal('Go to FAQs about these topics:');
    expect(firstAlertBoxLink.text()).to.equal('Signing in to VA.gov');
    expect(secondAlertBoxLink.text()).to.equal(
      'Verifying your identity on VA.gov',
    );
    expect(thirdAlertBoxLink.text()).to.equal('Privacy and security on VA.gov');
    wrapper.unmount();
  });
});

describe('mapStateToProps', () => {
  describe('isIdentityVerified', () => {
    it('should be `true` if the user is LOA3', () => {
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            loa: {
              current: 3,
            },
          },
        },
      });
      expect(mappedProps.isIdentityVerified).to.be.true;
    });
    it('should be `false` if the user is not LOA3', () => {
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            loa: {
              current: 1,
            },
          },
        },
      });
      expect(mappedProps.isIdentityVerified).to.be.false;
    });
  });

  describe('isMultifactorEnabled', () => {
    it('should be `true` if the user has multifactor enabled', () => {
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            multifactor: true,
            loa: {
              current: 1,
            },
          },
        },
      });
      expect(mappedProps.isMultifactorEnabled).to.be.true;
    });
    it('should be `false` if the user does not have multifactor enabled', () => {
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            multifactor: false,
            loa: {
              current: 1,
            },
          },
        },
      });
      expect(mappedProps.isMultifactorEnabled).to.be.false;
    });
  });

  describe('mhvAccount', () => {
    it('should be pulled from the profile', () => {
      const mhvAccount = {
        termsAndConditionsAccepted: false,
        accountState: 'needs_terms_acceptance',
      };
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            loa: {
              current: 1,
            },
            mhvAccount,
          },
        },
      });
      expect(mappedProps.mhvAccount).to.deep.equal(mhvAccount);
    });
  });

  describe('showMHVTermsAndConditions', () => {
    it('should be `true` if the user is verified and the user has accepted terms and conditions', () => {
      const mhvAccount = {
        termsAndConditionsAccepted: true,
      };
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            loa: {
              current: 1,
            },
            verified: true,
            mhvAccount,
          },
        },
      });
      expect(mappedProps.showMHVTermsAndConditions).to.be.true;
    });
    it('should be `true` if the user is verified and the user needs to accept terms and conditions', () => {
      const mhvAccount = {
        termsAndConditionsAccepted: false,
        accountState: 'needs_terms_acceptance',
      };
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            loa: {
              current: 1,
            },
            verified: true,
            mhvAccount,
          },
        },
      });
      expect(mappedProps.showMHVTermsAndConditions).to.be.true;
    });
    it('should be `false` if the user is verified but has neither accepted or needs to accept the terms and conditions', () => {
      const mhvAccount = {
        termsAndConditionsAccepted: false,
        accountState: 'another_state',
      };
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            loa: {
              current: 1,
            },
            verified: true,
            mhvAccount,
          },
        },
      });
      expect(mappedProps.showMHVTermsAndConditions).to.be.false;
    });
    it('should be `false` if the user is not verified', () => {
      const mhvAccount = {
        termsAndConditionsAccepted: true,
      };
      const mappedProps = mapStateToProps({
        user: {
          profile: {
            loa: {
              current: 1,
            },
            verified: false,
            mhvAccount,
          },
        },
      });
      expect(mappedProps.showMHVTermsAndConditions).to.be.false;
    });
  });
});
