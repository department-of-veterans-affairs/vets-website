import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import ClaimStatusPageContent from '../../../components/evss/ClaimStatusPageContent';

describe('<ClaimStatusPageContent>', () => {
  context('when cstUseClaimDetailsV2 feature flag enabled', () => {
    const claim = {
      attributes: {
        phase: 2,
        decisionLetterSent: true,
        open: true,
      },
    };
    const params = { id: 1 };

    const getStore = (cstUseClaimDetailsV2Enabled = true) =>
      createStore(() => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
        },
      }));
    it('should not render ClaimStatusPageContent with a timeline', () => {
      const { container } = render(
        <Provider store={getStore()}>
          <ClaimStatusPageContent
            params={params}
            claim={claim}
            showClaimLettersLink
          />
          ,
        </Provider>,
      );

      expect($('.claim-timeline', container)).not.to.exist;
    });
  });

  context('when showClaimLettersLink is "true"', () => {
    const claim = {
      attributes: {
        decisionLetterSent: true,
        open: false,
      },
    };
    it('renders a link to the claim letters page', () => {
      const screen = render(
        <ClaimStatusPageContent claim={claim} showClaimLettersLink />,
      );

      screen.getByText('Get your claim letters');
    });
  });

  context('when showClaimLettersLink is "false"', () => {
    const claim = {
      attributes: {
        decisionLetterSent: true,
        open: false,
      },
    };
    it('does not render a link to the claim letters page', () => {
      const screen = render(<ClaimStatusPageContent claim={claim} />);

      expect(screen.queryByText('Get your claim letters')).not.to.exist;
    });
  });
});
