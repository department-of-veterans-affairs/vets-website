import React from 'react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { expect } from 'chai';
import {
  getStatusDescription,
  getClaimStatusDescription,
  getClaimPhaseTypeHeaderText,
  getClaimPhaseTypeDescription,
} from '../../../utils/helpers';
import { renderWithRouter } from '../../utils';

import WhatWeAreDoing from '../../../components/claim-status-tab/WhatWeAreDoing';

const claim = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'UNDER_REVIEW',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
      },
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'INITIAL_REVIEW',
    supportingDocuments: [],
  },
};

describe('<WhatWeAreDoing>', () => {
  const getStore = (cstClaimPhasesEnabled = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_claim_phases: cstClaimPhasesEnabled,
      },
    }));

  const { status, claimPhaseDates } = claim.attributes;
  const claimPhaseType = claimPhaseDates.latestPhaseType;

  context('cstClaimPhases feature flag enabled', () => {
    it('should render a WhatWereDoing section', () => {
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing status={status} claimPhaseType={claimPhaseType} />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
  });

  context('cstClaimPhases feature flag disabled', () => {
    it('should render a WhatWereDoing section', () => {
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing status={status} claimPhaseType={claimPhaseType} />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
  });
});
