import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { render } from '@testing-library/react';
import { expect } from 'chai';
import NotEligible from '../../../../../components/direct-deposit/legacy/alerts/NotEligible';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('NotEligible', () => {
    it('passes axeCheck', () => {
      axeCheck(<NotEligible typeIsCNP benefitType="benefit-type" />);
    });
    it('renders disability message for CNP', () => {
      const { getByText } = render(
        <NotEligible typeIsCNP benefitType="benefit-type" />,
      );
      expect(
        getByText(
          'Our records show that you don’t receive VA disability compensation or pension payments.',
        ),
      ).to.be.ok;
    });
    it('render education message for education benefits', () => {
      const { getByText } = render(
        <NotEligible typeIsCNP={false} benefitType="benefit-type" />,
      );
      expect(
        getByText(
          'Our records show that you don’t receive VA education benefit payments or haven’t set up direct deposit payments.',
        ),
      ).to.be.ok;
    });
    it('renders correct links for CNP benefits', () => {
      const { getByText } = render(
        <NotEligible typeIsCNP benefitType="benefit-type" />,
      );
      expect(getByText('Learn more about disability eligibility')).to.be.ok;
      expect(getByText('Learn more about VA pension eligibility')).to.be.ok;
    });
    it('renders correct links for education benefits', () => {
      const { getByText, queryByText } = render(
        <NotEligible typeIsCNP={false} benefitType="benefit-type" />,
      );
      expect(
        getByText(
          'Learn more about GI Bill and other education benefit eligibility',
        ),
      ).to.be.ok;
      expect(queryByText('Learn more about VA pension eligibility')).to.be.null;
    });
  });
});
