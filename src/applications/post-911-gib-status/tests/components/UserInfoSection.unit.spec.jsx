import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';
import { UserInfoSection } from '../../components/UserInfoSection';

const props = {
  enrollmentData: {
    veteranIsEligible: true,
    activeDuty: true,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1988-03-01',
    vaFileNumber: '374374377',
    regionalProcessingOffice: 'Muskogee, OK',
    eligibilityDate: '2005-04-01',
    delimitingDate: null,
    percentageBenefit: 100,
    originalEntitlement: { months: 36, days: 0 },
    usedEntitlement: { months: 22, days: 3 },
    remainingEntitlement: { months: 0, days: 0 },
    entitlementTransferredOut: { months: 14, days: 0 },
  },
};
const currentHeadingSelector = '#current-as-of';

describe('<UserInfoSection>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  describe('showCurrentAsOfAlert is falsey', () => {
    it('should omit the "current as of" date when explicitly false', () => {
      const currentAsOfProps = _.merge({}, props, {
        showCurrentAsOfAlert: false,
      });
      const tree = SkinDeep.shallowRender(
        <UserInfoSection {...currentAsOfProps} />,
      );
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });

    it('should omit the "current as of" date when prop is undefined', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });
  });
  describe('UserInfoSection default props', () => {
    it('should default enrollmentData to an empty object when not provided', () => {
      const tree = SkinDeep.shallowRender(
        <UserInfoSection showCurrentAsOfAlert={false} />,
      );

      const nameInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Name');
      expect(nameInfoPair).to.exist;
      expect(nameInfoPair.props.value).to.equal('unavailable unavailable');

      const dobInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Date of birth');
      expect(dobInfoPair).to.exist;
      expect(dobInfoPair.props.value).to.equal('Unavailable');

      const rpoInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Regional Processing Office');
      expect(rpoInfoPair).to.exist;
      expect(rpoInfoPair.props.value).to.be.undefined;
    });
  });

  describe('showCurrentAsOfAlert is truthy', () => {
    it('should display the "current as of" date', () => {
      const currentAsOfProps = _.merge({}, props, {
        showCurrentAsOfAlert: true,
      });
      const tree = SkinDeep.shallowRender(
        <UserInfoSection {...currentAsOfProps} />,
      );
      expect(tree.subTree(currentHeadingSelector)).to.not.be.false;
    });
  });

  describe('veteran eligibility', () => {
    it('should show benefit information if eligible', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      const benefitLevel = tree.subTree('#benefit-level');
      expect(benefitLevel).to.not.be.false;
    });

    it('should show not qualified message if not eligible', () => {
      const newProps = {
        enrollmentData: {
          veteranIsEligible: false,
          dateOfBirth: '1995-11-12T06:00:00.000+0000',
          originalEntitlement: {},
          usedEntitlement: {},
          remainingEntitlement: {},
          enrollments: [],
        },
      };

      const tree = SkinDeep.shallowRender(<UserInfoSection {...newProps} />);
      const benefitLevel = tree.subTree('#benefit-level');
      expect(benefitLevel).to.be.false;
      const notQualifiedMessage = tree.subTree('.not-qualified');
      expect(notQualifiedMessage.text()).to.contain("You don't qualify");
    });
  });

  describe('percentageBenefit is not provided', () => {
    it('should display "unavailable"', () => {
      const noPercentageProps = {
        ...props,
        enrollmentData: {
          ...props.enrollmentData,
          percentageBenefit: null,
        },
      };

      const tree = SkinDeep.shallowRender(
        <UserInfoSection {...noPercentageProps} />,
      );
      const benefitLevel = tree.subTree('#benefit-level');
      expect(benefitLevel).to.not.be.false;
      expect(benefitLevel.text()).to.contain('unavailable');
    });
  });

  describe('should display benefit end date explanation', () => {
    it('should display active duty explanation when veteran is on active duty', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      const benefitEndDate = tree.subTree('.benefit-end-date');
      expect(benefitEndDate).to.not.be.false;
      expect(benefitEndDate.text()).to.contain('Since you’re on active duty');
    });

    it('should display the delimiting date when there is remaining entitlement and not active duty', () => {
      const remainingProps = {
        enrollmentData: {
          veteranIsEligible: true,
          activeDuty: false,
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: '1988-03-01',
          vaFileNumber: '374374377',
          regionalProcessingOffice: 'Muskogee, OK',
          eligibilityDate: '2005-04-01',
          delimitingDate: '2017-12-07T05:00:00.000+0000',
          percentageBenefit: 100,
          originalEntitlement: { months: 36, days: 0 },
          usedEntitlement: { months: 10, days: 0 },
          remainingEntitlement: { months: 12, days: 0 },
        },
      };

      const tree = SkinDeep.shallowRender(
        <UserInfoSection {...remainingProps} />,
      );
      const benefitEndDate = tree.subTree('.benefit-end-date');
      expect(benefitEndDate).to.not.be.false;
      expect(benefitEndDate.text()).to.contain('You have until');
    });
  });
  describe('date of birth InfoPair', () => {
    it('should display the formatted date of birth if present', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      const dobInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Date of birth');
      expect(dobInfoPair).to.exist;
      expect(dobInfoPair.props.value).to.equal('March 1, 1988');
    });

    it('should display "Unavailable" if dateOfBirth is missing', () => {
      const noDobProps = _.merge({}, props, {
        enrollmentData: {
          dateOfBirth: null,
        },
      });
      const tree = SkinDeep.shallowRender(<UserInfoSection {...noDobProps} />);
      const dobInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Date of birth');
      expect(dobInfoPair).to.exist;
      expect(dobInfoPair.props.value).to.equal('Unavailable');
    });
  });
  describe('entitlement info', () => {
    it('should display months transferred to dependents when entitlementTransferredOut is present', () => {
      const tree = SkinDeep.shallowRender(
        <UserInfoSection {...props} showTransferredOutMonths />,
      );

      const transferredPair = tree
        .everySubTree('InfoPair')
        .find(
          pair => pair.props.label === 'Months transferred to your dependents',
        );

      expect(transferredPair).to.exist;
      expect(transferredPair.props.value).to.equal('14 months, 0 days');
    });
  });
});
