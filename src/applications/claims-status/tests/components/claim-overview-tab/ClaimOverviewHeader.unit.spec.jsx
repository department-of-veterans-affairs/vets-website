import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import ClaimOverviewHeader from '../../../components/claim-overview-tab/ClaimOverviewHeader';

const getStore = (cstClaimPhasesEnabled = true) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_claim_phases: cstClaimPhasesEnabled,
    },
  }));

const dependencyClaimTypeCode = '400PREDSCHRG';
const compensationClaimTypeCode = '110LCMP7IDES'; // 5103 Notice

describe('<ClaimOverviewHeader>', () => {
  context(
    'cstClaimPhases feature flag enabled and compenstaiton claim type code',
    () => {
      it('should render a ClaimOverviewHeader section', () => {
        const { container, getByText } = render(
          <Provider store={getStore()}>
            <ClaimOverviewHeader claimTypeCode={compensationClaimTypeCode} />
          </Provider>,
        );
        expect($('.claim-overview-header-container', container)).to.exist;
        getByText(
          'There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.',
        );
      });
    },
  );

  context(
    'cstClaimPhases feature flag enabled and dependency claim type code',
    () => {
      it('should render a ClaimOverviewHeader section', () => {
        const { container, getByText } = render(
          <Provider store={getStore()}>
            <ClaimOverviewHeader claimTypeCode={dependencyClaimTypeCode} />
          </Provider>,
        );
        expect($('.claim-overview-header-container', container)).to.exist;
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
      });
    },
  );

  context('cstClaimPhases feature flag disabled', () => {
    context(
      'cstClaimPhases feature flag enabled and compenstaiton claim type code',
      () => {
        it('should render a ClaimOverviewHeader section', () => {
          const { container, getByText } = render(
            <Provider store={getStore(false)}>
              <ClaimOverviewHeader claimTypeCode={compensationClaimTypeCode} />
            </Provider>,
          );
          expect($('.claim-overview-header-container', container)).to.exist;
          getByText(
            'Learn about the VA claim process and what happens after you file your claim.',
          );
        });
      },
    );
    context(
      'cstClaimPhases feature flag enabled and dependency claim type code',
      () => {
        it('should render a ClaimOverviewHeader section', () => {
          const { container, getByText } = render(
            <Provider store={getStore(false)}>
              <ClaimOverviewHeader claimTypeCode={dependencyClaimTypeCode} />
            </Provider>,
          );
          expect($('.claim-overview-header-container', container)).to.exist;
          getByText(
            'Learn about the VA claim process and what happens after you file your claim.',
          );
        });
      },
    );
  });
});
