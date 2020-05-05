import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import { expect } from 'chai';

import localStorage from 'platform/utilities/storage/localStorage';
import { DashboardApp, mapStateToProps } from '../../containers/DashboardApp';

const defaultProps = {
  profile: {
    verified: false,
    loa: {
      current: 1,
    },
  },
};

describe('<DashboardApp>', () => {
  before(() => {
    sinon.stub(localStorage, 'getItem');
  });

  after(() => {
    localStorage.getItem.restore();
  });

  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DashboardApp {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.be.ok;
  });

  it('should render empty state links if there are no available widgets', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 1 }, verified: false }} />,
    );
    expect(tree.toString()).to.contain('<EmptyStateLinks />');
  });

  it('should not render empty state links if there are available widgets', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp
        canAccessRx
        profile={{ loa: { current: 1 }, verified: false }}
      />,
    );
    expect(tree.toString()).not.to.contain('<EmptyStateLinks />');
  });

  it('should render verification state if LOA != 3', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 1 }, verified: false }} />,
    );
    expect(tree.toString()).to.contain('Verify your identity to access more');
    expect(tree.toString()).to.contain('tools and features');
  });

  it('should not render verification state if profile is verified', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 3 }, verified: true }} />,
    );
    expect(tree.toString()).not.to.contain(
      'Verify your identity to access more',
    );
    expect(tree.toString()).not.to.contain('tools and features');
  });

  it('should render MVI warning state if status not OK and LOA.current is not 1', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 3 }, status: 'ERROR' }} />,
    );
    expect(tree.toString()).to.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
  });

  it('should not render MVI warning state if status is OK', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 3 }, status: 'OK' }} />,
    );
    expect(tree.toString()).not.to.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
  });

  it('should not render MVI warning state if LOA.current is 1', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 1 }, status: 'ERROR' }} />,
    );
    expect(tree.toString()).not.to.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
  });

  it('should render the ViewYourProfile2 section when showProfile 2 is true', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp {...defaultProps} showProfile2 />,
    );
    expect(tree.toString()).to.contain('<ViewYourProfile2 />');
  });

  it('should not render the Manage Your Account section when showProfile 2 is true', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp {...defaultProps} showProfile2 />,
    );
    expect(tree.toString()).not.to.contain('<ManageYourAccount />');
  });

  it('should render the Manage Your Account section when showProfile 2 is false', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 3 }, showProfile2: false }} />,
    );
    expect(tree.toString()).to.contain('<ManageYourAccount />');
  });

  it('should not render warnings if information available', () => {
    const props = {
      profile: {
        loa: {
          current: 3,
        },
        status: 'OK',
        verified: true,
      },
    };

    const tree = SkinDeep.shallowRender(<DashboardApp {...props} />);
    expect(tree.toString()).to.not.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
    expect(tree.toString()).to.not.contain(
      'Verify your identity to access more VA.gov tools and features',
    );
  });
});

describe('mapStateToProps', () => {
  const defaultState = () => ({
    featureToggles: {
      dashboardShowCovid19Alert: true,
    },
    hcaEnrollmentStatus: {},
    user: {
      profile: {
        services: [],
        facilities: [],
      },
    },
  });
  describe('showCOVID19Alert', () => {
    it('is set to true when the user is a patient in a VISN23 health care system', () => {
      const state = defaultState();
      state.user.profile.facilities = [
        { facilityId: 'abc' },
        { facilityId: '123' },
        { facilityId: '656' }, // St. Cloud VA is in VISN23
      ];
      const props = mapStateToProps(state);
      expect(props.showCOVID19Alert).to.be.true;
    });
    it('is set to false when the user is a patient in a VISN8 health care system', () => {
      const state = defaultState();
      state.user.profile.facilities = [
        { facilityId: 'abc' },
        { facilityId: '123' },
        { facilityId: '548' }, // West Palm Beach is in VISN8
      ];
      const props = mapStateToProps(state);
      expect(props.showCOVID19Alert).to.be.false;
    });
    it('is set to false when the user is not a patient in an eligible health care system', () => {
      const state = defaultState();
      state.user.profile.facilities = [{ facilityId: 'abc' }];
      const props = mapStateToProps(state);
      expect(props.showCOVID19Alert).to.be.false;
    });
  });
  describe('showProfile2', () => {
    it('is set to true when the feature flag "profile_show_profile_2.0" is turned on', () => {
      const state = defaultState();
      const profile2 = 'profile_show_profile_2.0';
      state.featureToggles[profile2] = true;
      const props = mapStateToProps(state);
      expect(props.showProfile2).to.be.true;
    });
  });
  describe('vaHealthChatEligibleFacilityId', () => {
    it("is set to the facilityId of the facility that's eligible for VA health chat", () => {
      const state = defaultState();
      state.user.profile.facilities = [
        { facilityId: 'abc' },
        { facilityId: '123' },
        { facilityId: '656' }, // St. Cloud VA is in VISN23
      ];
      const props = mapStateToProps(state);
      expect(props.vaHealthChatEligibleSystemId).to.equal('656');
    });
    it('is set to null when the user is not a patient in an eligible health care system', () => {
      const state = defaultState();
      state.user.profile.facilities = [
        { facilityId: 'abc' },
        { facilityId: '123' },
        { facilityId: '548' }, // West Palm Beach is in VISN8
      ];
      state.user.profile.facilities = [{ facilityId: 'abc' }];
      const props = mapStateToProps(state);
      expect(props.vaHealthChatEligibleSystemId).to.be.null;
    });
    it('is set to null when the user is not a patient in an eligible health care system', () => {
      const state = defaultState();
      state.user.profile.facilities = [{ facilityId: 'abc' }];
      const props = mapStateToProps(state);
      expect(props.vaHealthChatEligibleSystemId).to.be.null;
    });
  });
});
