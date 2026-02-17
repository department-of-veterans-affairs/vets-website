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

const dependencyClaimPhase1 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'CLAIM_RECEIVED',
      previousPhases: {},
    },
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'CLAIM_RECEIVED',
    supportingDocuments: [],
  },
};

const dependencyClaimPhase2 = {
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
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'INITIAL_REVIEW',
    supportingDocuments: [],
  },
};

const dependencyClaimPhase3 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: true,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
        phase2CompleteDate: '2023-02-08',
      },
    },
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const dependencyClaimPhase4 = {
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
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const dependencyClaimPhase5 = {
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
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const dependencyClaimPhase6 = {
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
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const dependencyClaimPhase7 = {
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
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'PREPARATION_FOR_NOTIFICATION',
    supportingDocuments: [],
  },
};

const compensationClaimPhase1 = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'CLAIM_RECEIVED',
      previousPhases: {},
    },
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'CLAIM_RECEIVED',
    supportingDocuments: [],
  },
};

const compensationClaimPhase2 = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'INITIAL_REVIEW',
    supportingDocuments: [],
  },
};

const compensationClaimPhase3 = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const compensationClaimPhase4 = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const compensationClaimPhase5 = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const compensationClaimPhase6 = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    supportingDocuments: [],
  },
};

const compensationClaimPhase7 = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
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
    context('claim is a disability compensation claim', () => {
      it('should render a WhatWereDoing section when claim phase 1', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase1.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseDates.latestPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
        getByText(getClaimPhaseTypeDescription(claimPhaseType));
        getByText('Moved to this step on February 8, 2023');
        expect(getByRole('link')).to.have.text('Learn more about this step');
      });
      it('should render a WhatWereDoing section when claim phase 2', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase2.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
        getByText(getClaimPhaseTypeDescription(claimPhaseType));
        getByText('Moved to this step on February 8, 2023');
        expect(getByRole('link')).to.have.text('Learn more about this step');
      });
      it('should render a WhatWereDoing section when claim phase 3', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase3.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
        getByText(getClaimPhaseTypeDescription(claimPhaseType));
        getByText('Moved to this step on February 8, 2023');
        expect(getByRole('link')).to.have.text('Learn more about this step');
      });
      it('should render a WhatWereDoing section when claim phase 4', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase4.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
        getByText(getClaimPhaseTypeDescription(claimPhaseType));
        getByText('Moved to this step on February 8, 2023');
        expect(getByRole('link')).to.have.text('Learn more about this step');
      });
      it('should render a WhatWereDoing section when claim phase 5', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase5.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
        getByText(getClaimPhaseTypeDescription(claimPhaseType));
        getByText('Moved to this step on February 8, 2023');
        expect(getByRole('link')).to.have.text('Learn more about this step');
      });
      it('should render a WhatWereDoing section when claim phase 6', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase6.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
        getByText(getClaimPhaseTypeDescription(claimPhaseType));
        getByText('Moved to this step on February 8, 2023');
        expect(getByRole('link')).to.have.text('Learn more about this step');
      });
      it('should render a WhatWereDoing section when claim phase 7', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase7.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getClaimPhaseTypeHeaderText(claimPhaseType));
        getByText(getClaimPhaseTypeDescription(claimPhaseType));
        getByText('Moved to this step on February 8, 2023');
        expect(getByRole('link')).to.have.text('Learn more about this step');
      });
    });

    context('claim is not a disability compensation claim', () => {
      it('should render a WhatWereDoing section when claim phase 1', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase1.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 2', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase2.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 3', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase3.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 4', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase4.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 5', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase5.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 6', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase6.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 7', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase7.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
    });
  });

  context('cstClaimPhases feature flag disabled', () => {
    context('claim is a disability compensation claim', () => {
      it('should render a WhatWereDoing section when claim phase 1', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase1.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 2', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase2.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 3', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase3.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 4', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase4.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 5', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase5.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 6', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase6.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 7', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          compensationClaimPhase7.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
    });

    context('claim is not a disability compensation claim', () => {
      it('should render a WhatWereDoing section when claim phase 1', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase1.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 2', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase2.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 3', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase3.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 4', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase4.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 5', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase5.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 6', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase6.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when claim phase 7', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase7.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { getByText, getByRole, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(getStatusDescription(status));
        getByText(getClaimStatusDescription(status));
        expect(queryByText('Moved to this step on February 8, 2023')).to.not
          .exist;
        expect(getByRole('link')).to.have.text(
          'Learn more about the review process',
        );
      });
      it('should render a WhatWereDoing section when current phase back is set to true', () => {
        const { status, claimPhaseDates, claimTypeCode } =
          dependencyClaimPhase3.attributes;
        const claimPhaseType = claimPhaseDates.latestPhaseType;
        const { currentPhaseBack } = claimPhaseDates;
        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <WhatWeAreDoing
              status={status}
              claimPhaseType={claimPhaseType}
              currentPhaseBack={currentPhaseBack}
              phaseChangeDate={claimPhaseDates.phaseChangeDate}
              claimTypeCode={claimTypeCode}
            />
          </Provider>,
        );

        getByText(
          'We moved your claim back to this step because we needed to find or review more evidence',
        );
      });
    });
  });
});
