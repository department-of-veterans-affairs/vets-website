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

const claimPhase1 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'CLAIM_RECEIVED',
      previousPhases: {},
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'CLAIM_RECEIVED',
    supportingDocuments: [],
  },
};

const claimPhase2 = {
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

const claimPhase3 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
        phase2CompleteDate: '2023-02-08',
      },
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const claimPhase4 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'REVIEW_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
        phase2CompleteDate: '2023-02-08',
        phase3CompleteDate: '2023-02-08',
      },
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const claimPhase5 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'PREPARATION_FOR_DECISION',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
        phase2CompleteDate: '2023-02-08',
        phase3CompleteDate: '2023-02-08',
        phase4CompleteDate: '2023-02-08',
      },
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const claimPhase6 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'PENDING_DECISION_APPROVAL',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
        phase2CompleteDate: '2023-02-08',
        phase3CompleteDate: '2023-02-08',
        phase4CompleteDate: '2023-02-08',
        phase5CompleteDate: '2023-02-08',
      },
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const claimPhase7 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'PREPARATION_FOR_NOTIFICATION',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
        phase2CompleteDate: '2023-02-08',
        phase3CompleteDate: '2023-02-08',
        phase4CompleteDate: '2023-02-08',
        phase5CompleteDate: '2023-02-08',
        phase6CompleteDate: '2023-02-08',
      },
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'PREPARATION_FOR_NOTIFICATION',
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

  context('cstClaimPhases feature flag enabled', () => {
    it('should render a WhatWereDoing section when claim phase 1', () => {
      const { status, claimPhaseDates } = claimPhase1.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseDates.latestPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      getByText('Moved to this step on February 8, 2023');
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
    it('should render a WhatWereDoing section when claim phase 2', () => {
      const { status, claimPhaseDates } = claimPhase2.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      getByText('Moved to this step on February 8, 2023');
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
    it('should render a WhatWereDoing section when claim phase 3', () => {
      const { status, claimPhaseDates } = claimPhase3.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      getByText('Moved to this step on February 8, 2023');
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
    it('should render a WhatWereDoing section when claim phase 4', () => {
      const { status, claimPhaseDates } = claimPhase4.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      getByText('Moved to this step on February 8, 2023');
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
    it('should render a WhatWereDoing section when claim phase 5', () => {
      const { status, claimPhaseDates } = claimPhase5.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      getByText('Moved to this step on February 8, 2023');
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
    it('should render a WhatWereDoing section when claim phase 6', () => {
      const { status, claimPhaseDates } = claimPhase6.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      getByText('Moved to this step on February 8, 2023');
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
    it('should render a WhatWereDoing section when claim phase 7', () => {
      const { status, claimPhaseDates } = claimPhase7.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole } = renderWithRouter(
        <Provider store={getStore()}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
      getByText(getClaimPhaseTypeDescription(claimPhaseType));
      getByText('Moved to this step on February 8, 2023');
      expect(getByRole('link')).to.have.text('Learn more about this step');
    });
  });

  context('cstClaimPhases feature flag disabled', () => {
    it('should render a WhatWereDoing section when claim phase 2', () => {
      const { status, claimPhaseDates } = claimPhase1.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole, queryByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(queryByText('Moved to this step on February 8, 2023')).to.not
        .exist;
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
    it('should render a WhatWereDoing section when claim phase 2', () => {
      const { status, claimPhaseDates } = claimPhase2.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole, queryByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(queryByText('Moved to this step on February 8, 2023')).to.not
        .exist;
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
    it('should render a WhatWereDoing section when claim phase 3', () => {
      const { status, claimPhaseDates } = claimPhase3.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole, queryByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(queryByText('Moved to this step on February 8, 2023')).to.not
        .exist;
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
    it('should render a WhatWereDoing section when claim phase 4', () => {
      const { status, claimPhaseDates } = claimPhase4.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole, queryByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(queryByText('Moved to this step on February 8, 2023')).to.not
        .exist;
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
    it('should render a WhatWereDoing section when claim phase 5', () => {
      const { status, claimPhaseDates } = claimPhase5.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole, queryByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(queryByText('Moved to this step on February 8, 2023')).to.not
        .exist;
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
    it('should render a WhatWereDoing section when claim phase 6', () => {
      const { status, claimPhaseDates } = claimPhase6.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole, queryByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(queryByText('Moved to this step on February 8, 2023')).to.not
        .exist;
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
    it('should render a WhatWereDoing section when claim phase 7', () => {
      const { status, claimPhaseDates } = claimPhase7.attributes;
      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { getByText, getByRole, queryByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <WhatWeAreDoing
            status={status}
            claimPhaseType={claimPhaseType}
            phaseChangeDate={claimPhaseDates.phaseChangeDate}
          />
        </Provider>,
      );

      getByText(getStatusDescription(status));
      getByText(getClaimStatusDescription(status));
      expect(queryByText('Moved to this step on February 8, 2023')).to.not
        .exist;
      expect(getByRole('link')).to.have.text('Overview of the process');
    });
  });
});
