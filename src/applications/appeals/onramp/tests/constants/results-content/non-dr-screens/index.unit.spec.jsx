import { expect } from 'chai';
import { render } from '@testing-library/react';
import { getDynamicPageContent } from '../../../../constants/results-content/non-dr-screens';
import { RESPONSES } from '../../../../constants/question-data-map';
import * as p from '../../../../constants/results-content/non-dr-screens/dynamic-page-content';

const { NO, YES } = RESPONSES;

describe('non DR screens utilities', () => {
  describe('getDynamicPageContent', () => {
    describe('when the display conditions are met', () => {
      it('should return the correct content bullet points', () => {
        const formResponses = {
          Q_1_2A_1_SERVICE_CONNECTED: NO,
          Q_1_2B_LAW_POLICY_CHANGE: NO,
          Q_1_2A_CONDITION_WORSENED: NO,
        };

        const screen = render(getDynamicPageContent(formResponses));

        expect(
          screen.getByTestId('page-dynamic-content-0').textContent,
        ).to.contain(p.CLAIM_OVER_YEAR_OLD);
        expect(
          screen.getByTestId('page-dynamic-content-1').textContent,
        ).to.contain(p.NOT_SERVICE_CONNECTED);
        expect(
          screen.getByTestId('page-dynamic-content-2').textContent,
        ).to.contain(p.NO_NEW_RELEVANT_EVIDENCE);
        expect(
          screen.getByTestId('page-dynamic-content-3').textContent,
        ).to.contain(p.NOT_LAW_POLICY_CHANGE);
        expect(
          screen.getByTestId('page-dynamic-content-4').textContent,
        ).to.contain(p.CONDITION_NOT_WORSE);
      });
    });

    describe('when the display conditions are not met', () => {
      it('should return the two items that do not have display conditions', () => {
        const formResponses = {
          Q_1_2A_1_SERVICE_CONNECTED: YES,
          Q_1_2B_LAW_POLICY_CHANGE: YES,
          Q_1_2A_CONDITION_WORSENED: YES,
        };

        const screen = render(getDynamicPageContent(formResponses));

        expect(
          screen.getByTestId('page-dynamic-content-0').textContent,
        ).to.contain(p.CLAIM_OVER_YEAR_OLD);
        expect(
          screen.getByTestId('page-dynamic-content-1').textContent,
        ).to.contain(p.NO_NEW_RELEVANT_EVIDENCE);
      });
    });
  });
});
