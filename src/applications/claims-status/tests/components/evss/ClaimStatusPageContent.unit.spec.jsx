import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import ClaimStatusPageContent from '../../../components/evss/ClaimStatusPageContent';

describe('<ClaimStatusPageContent>', () => {
  const getStore = (cstUseClaimDetailsV2Enabled = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
      },
    }));

  context('when cstUseClaimDetailsV2 feature flag enabled', () => {
    const params = { id: 1 };
    it('should render ClaimStatusPageContent without a timeline and with a WhatYouNeedToDo section without alerts', () => {
      const claim = {
        id: '1',
        attributes: {
          phase: 2,
          decisionLetterSent: true,
          open: true,
          eventsTimeline: [],
        },
      };
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
      expect($('.what-you-need-to-do-container', container)).to.exist;
      expect($('va-alert', container)).not.to.exist;
      expect($('.need-files-alert', container)).not.to.exist;
    });

    it('should render ClaimStatusPageContent without a timeline and with a WhatYouNeedToDo section', () => {
      const claim = {
        id: '1',
        attributes: {
          open: true,
          phase: 3,
          dateFiled: '2023-01-01',
          documentsNeeded: true,
          decisionLetterSent: false,
          eventsTimeline: [
            {
              trackedItemId: 1,
              type: 'still_need_from_you_list',
              status: 'NEEDED',
              displayName: 'Test',
              description: 'Test',
              suspenseDate: '2024-02-01',
              date: '2023-01-01',
            },
          ],
        },
      };
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
      expect($('.what-you-need-to-do-container', container)).to.exist;
      expect($('va-alert', container)).to.exist;
      expect($('.need-files-alert', container)).not.to.exist;
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
        <Provider store={getStore(false)}>
          <ClaimStatusPageContent claim={claim} showClaimLettersLink />,
        </Provider>,
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
      const screen = render(
        <Provider store={getStore(false)}>
          <ClaimStatusPageContent claim={claim} />
        </Provider>,
      );

      expect(screen.queryByText('Get your claim letters')).not.to.exist;
    });
  });
});
