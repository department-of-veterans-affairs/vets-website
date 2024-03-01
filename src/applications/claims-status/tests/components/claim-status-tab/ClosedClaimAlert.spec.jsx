import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClosedClaimAlert from '../../../components/claim-status-tab/ClosedClaimAlert';

describe('<ClosedClaimAlert>', () => {
  context('when closeDate null', () => {
    const date = null;
    context('when decisionLetterSent false', () => {
      it('should render message without date sentence', () => {
        const { container, queryByText } = render(
          <ClosedClaimAlert closeDate={date} />,
        );
        const link = $('.link-action-container', container);
        expect(link).not.to.exist;
        expect(queryByText('We decided your claim on')).not.to.exist;
      });
    });
    context('when decisionLetterSent true', () => {
      it('should render message without date sentence and with a link', () => {
        const { container, queryByText } = render(
          <ClosedClaimAlert closeDate={date} decisionLetterSent="true" />,
        );
        const link = $('.link-action-container', container);
        expect(link).to.exist;
        expect(queryByText('We decided your claim on')).not.to.exist;
      });
    });
  });
  context('when closeDate exists', () => {
    const date = '2010-03-01';
    context('when decisionLetterSent false', () => {
      it('should render message with date sentence', () => {
        const { container, queryByText } = render(
          <ClosedClaimAlert closeDate={date} />,
        );
        const link = $('.link-action-container', container);
        expect(link).not.to.exist;
        expect(queryByText('We decided your claim on March 1, 2010')).to.exist;
      });
    });
    context('when decisionLetterSent true', () => {
      it('should render message with date sentence and with a link', () => {
        const { container, queryByText } = render(
          <ClosedClaimAlert closeDate={date} decisionLetterSent="true" />,
        );
        const link = $('.link-action-container', container);
        expect(link).to.exist;
        expect(queryByText('We decided your claim on March 1, 2010')).to.exist;
      });
    });
  });
});
