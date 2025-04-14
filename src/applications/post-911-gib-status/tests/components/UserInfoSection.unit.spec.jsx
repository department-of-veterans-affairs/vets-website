import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import UserInfoSection from '../../components/UserInfoSection';

const props = {
  enrollmentData: {
    veteranIsEligible: true,
    activeDuty: false,
    firstName: 'Joe',
    lastName: 'West',
    dateOfBirth: '1995-11-12T06:00:00.000+0000',
    vaFileNumber: '12345678',
    regionalProcessingOffice: 'Central Office Washington, DC',
    eligibilityDate: '2016-12-01T05:00:00.000+0000',
    delimitingDate: '2017-12-07T05:00:00.000+0000',
    originalEntitlement: { months: 36, days: 0 },
    usedEntitlement: { months: 3, days: 0 },
    remainingEntitlement: { months: 33, days: 0 },
    enrollments: [
      {
        beginDate: '2012-11-01T04:00:00.000+0000',
        endDate: '2012-12-01T05:00:00.000+0000',
        facilityCode: '11902614',
        facilityName: 'PURDUE UNIVERSITY',
        fullTimeHours: 12,
        onlineHours: 6,
        onCampusHours: 6,
        trainingType: 'UnderGrad',
        yellowRibbonAmount: 0,
      },
    ],
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
    it('should omit the "current as of" date', () => {
      const currentAsOfProps = _.merge({}, props, {
        showCurrentAsOfAlert: false,
      });
      const tree = SkinDeep.shallowRender(
        <UserInfoSection {...currentAsOfProps} />,
      );
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });

    it('should omit the "current as of" date', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });
  });
  describe('UserInfoSection default props', () => {
    it('should default enrollmentData to an empty object when not provided', () => {
      // Render the component without an enrollmentData prop.
      const tree = SkinDeep.shallowRender(
        <UserInfoSection showCurrentAsOfAlert={false} />,
      );

      // Since enrollmentData is undefined, the default {} will be used.
      // Therefore, firstName and lastName are undefined and the full name will be "undefined undefined".
      const nameInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Name');
      expect(nameInfoPair).to.exist;
      expect(nameInfoPair.props.value).to.equal('undefined undefined');

      // The Date of birth should default to "Unavailable"
      const dobInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Date of birth');
      expect(dobInfoPair).to.exist;
      expect(dobInfoPair.props.value).to.equal('Unavailable');

      // The Regional Processing Office value will be undefined
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
    // TODO: handle corrupt data department-of-veterans-affairs/vets.gov-team#3782
    it('should display "unavailable"', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      const benefitLevel = tree.subTree('#benefit-level');
      expect(benefitLevel).to.not.be.false;
      expect(benefitLevel.text()).to.contain('unavailable');
    });
  });

  describe('should display delimitingDate', () => {
    it('should display the delimiting date', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      const benefitEndDate = tree.subTree('.benefit-end-date');
      expect(benefitEndDate).to.not.be.false;
      expect(benefitEndDate.text()).to.contain('You have until');
    });

    it('should not display the delimiting date if active duty', () => {
      const newProps = {
        enrollmentData: {
          veteranIsEligible: true,
          dateOfBirth: '1995-11-12T06:00:00.000+0000',
          activeDuty: true,
          originalEntitlement: {},
          usedEntitlement: {},
          remainingEntitlement: {},
          enrollments: [],
        },
      };

      const tree = SkinDeep.shallowRender(<UserInfoSection {...newProps} />);
      const benefitEndDate = tree.subTree('.benefit-end-date');
      expect(benefitEndDate).to.not.be.false;
      expect(benefitEndDate.text()).to.contain('Since you’re on active duty');
    });
  });
  describe('date of birth InfoPair', () => {
    it('should display the formatted date of birth if present', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props} />);
      const dobInfoPair = tree
        .everySubTree('InfoPair')
        .find(pair => pair.props.label === 'Date of birth');
      expect(dobInfoPair).to.exist;
      expect(dobInfoPair.props.value).to.equal('November 12, 1995');
    });

    it('should display "Unavailable" if dateOfBirth is missing', () => {
      // Create a copy of props but remove dateOfBirth
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
});
