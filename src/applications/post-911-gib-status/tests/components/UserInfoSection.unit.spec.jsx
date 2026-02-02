import React from 'react';
import { render } from '@testing-library/react';
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
    const { container } = render(<UserInfoSection {...props} />);
    expect(container.querySelector('*')).to.not.be.undefined;
  });

  describe('showCurrentAsOfAlert is falsey', () => {
    it('should omit the "current as of" date when explicitly false', () => {
      const currentAsOfProps = _.merge({}, props, {
        showCurrentAsOfAlert: false,
      });
      const { container } = render(
        <UserInfoSection {...currentAsOfProps} />,
      );
      expect(container.querySelector(currentHeadingSelector)).to.be.null;
    });

    it('should omit the "current as of" date when prop is undefined', () => {
      const { container } = render(<UserInfoSection {...props} />);
      expect(container.querySelector(currentHeadingSelector)).to.be.null;
    });
  });
  describe('UserInfoSection default props', () => {
    it('should default enrollmentData to an empty object when not provided', () => {
      const { container } = render(
        <UserInfoSection showCurrentAsOfAlert={false} />,
      );

      // Check that the component renders with default values
      expect(container.textContent).to.contain('Name');
      expect(container.textContent).to.contain('unavailable unavailable');

      expect(container.textContent).to.contain('Date of birth');
      expect(container.textContent).to.contain('Unavailable');

      // When enrollmentData is not provided, veteranIsEligible defaults to undefined/falsy,
      // so the not-qualified message is shown instead of the benefits section
      expect(container.textContent).to.contain("You don't qualify");
    });
  });

  describe('showCurrentAsOfAlert is truthy', () => {
    it('should display the "current as of" date', () => {
      const currentAsOfProps = _.merge({}, props, {
        showCurrentAsOfAlert: true,
      });
      const { container } = render(
        <UserInfoSection {...currentAsOfProps} />,
      );
      expect(container.querySelector(currentHeadingSelector)).to.not.be.null;
    });
  });

  describe('veteran eligibility', () => {
    it('should show benefit information if eligible', () => {
      const { container } = render(<UserInfoSection {...props} />);
      const benefitLevel = container.querySelector('#benefit-level');
      expect(benefitLevel).to.not.be.null;
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

      const { container } = render(<UserInfoSection {...newProps} />);
      const benefitLevel = container.querySelector('#benefit-level');
      expect(benefitLevel).to.be.null;
      const notQualifiedMessage = container.querySelector('.not-qualified');
      expect(notQualifiedMessage.textContent).to.contain("You don't qualify");
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

      const { container } = render(
        <UserInfoSection {...noPercentageProps} />,
      );
      const benefitLevel = container.querySelector('#benefit-level');
      expect(benefitLevel).to.not.be.null;
      expect(benefitLevel.textContent).to.contain('unavailable');
    });
  });

  describe('should display benefit end date explanation', () => {
    it('should display active duty explanation when veteran is on active duty', () => {
      const { container } = render(<UserInfoSection {...props} />);
      const benefitEndDate = container.querySelector('.benefit-end-date');
      expect(benefitEndDate).to.not.be.null;
      expect(benefitEndDate.textContent).to.contain('on active duty');
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

      const { container } = render(
        <UserInfoSection {...remainingProps} />,
      );
      const benefitEndDate = container.querySelector('.benefit-end-date');
      expect(benefitEndDate).to.not.be.null;
      expect(benefitEndDate.textContent).to.contain('You have until');
    });
  });
  describe('date of birth InfoPair', () => {
    it('should display the formatted date of birth if present', () => {
      const { container } = render(<UserInfoSection {...props} />);
      expect(container.textContent).to.contain('Date of birth');
      expect(container.textContent).to.contain('March 1, 1988');
    });

    it('should display "Unavailable" if dateOfBirth is missing', () => {
      const noDobProps = _.merge({}, props, {
        enrollmentData: {
          dateOfBirth: null,
        },
      });
      const { container } = render(<UserInfoSection {...noDobProps} />);
      expect(container.textContent).to.contain('Date of birth');
      expect(container.textContent).to.contain('Unavailable');
    });
  });
  describe('entitlement info', () => {
    it('should display months transferred to dependents when entitlementTransferredOut is present', () => {
      const { container } = render(
        <UserInfoSection {...props} showTransferredOutMonths />,
      );

      expect(container.textContent).to.contain('Months transferred to your dependents');
      expect(container.textContent).to.contain('14 months, 0 days');
    });
  });
});
