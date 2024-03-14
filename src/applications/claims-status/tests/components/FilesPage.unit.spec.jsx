import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { createStore } from 'redux';
import { FilesPage } from '../../containers/FilesPage';
import * as AdditionalEvidencePage from '../../components/claim-files-tab/AdditionalEvidencePage';

const getStore = (cstUseClaimDetailsV2Enabled = true) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
    },
  }));

describe('<FilesPage>', () => {
  context('cstUseClaimDetailsV2 feature flag enabled', () => {
    let stub;
    before(() => {
      // Stubbing out AdditionalEvidencePage because we're not interested
      // in setting up all of the redux state needed to test it
      stub = sinon.stub(AdditionalEvidencePage, 'default');
      stub.returns(<div data-testid="additional-evidence-page" />);
    });

    after(() => {
      stub.restore();
    });

    context('when claim is open', () => {
      it('should render files page, showing additional evidence section without alerts, and docs filed section', () => {
        const claim = {
          id: '1',
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2023-02-08',
              latestPhaseType: 'INITIAL_REVIEW',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
              },
            },
            closeDate: null,
            documentsNeeded: false,
            decisionLetterSent: false,
            status: 'INITIAL_REVIEW',
            supportingDocuments: [],
            trackedItems: [],
          },
        };

        const { container, getByTestId } = render(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
            />
            ,
          </Provider>,
        );
        const filesPage = $('#tabPanelFiles', container);

        expect(filesPage).to.exist;
        expect($('.claim-file-header-container', container)).to.exist;
        expect(getByTestId('additional-evidence-page')).to.exist;
        expect($('.documents-filed-container', container)).to.exist;
        expect($('.claims-requested-files-container', container)).not.to.exist;
      });

      it('should render files page, showing additional evidence section with alerts, and docs filed section when using lighthouse', () => {
        const claim = {
          id: '1',
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2023-02-08',
              latestPhaseType: 'INITIAL_REVIEW',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
              },
            },
            closeDate: null,
            documentsNeeded: false,
            decisionLetterSent: false,
            status: 'INITIAL_REVIEW',
            supportingDocuments: [],
            trackedItems: [
              {
                id: 1,
                status: 'NEEDED_FROM_YOU',
                displayName: 'Test',
                description: 'Test',
                suspenseDate: '2024-02-01',
                date: '2023-01-01',
              },
            ],
          },
        };
        const { container, getByTestId } = render(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
            />
            ,
          </Provider>,
        );
        const filesPage = $('#tabPanelFiles', container);

        expect(filesPage).to.exist;
        expect($('.claim-file-header-container', container)).to.exist;
        expect(getByTestId('additional-evidence-page')).to.exist;
        expect($('.documents-filed-container', container)).to.exist;
        expect($('.claims-requested-files-container', container)).to.not.exist;
      });
    });

    context('when claim is closed', () => {
      it('should render files page, showing additional evidence section, and docs filed section', () => {
        const claim = {
          id: '1',
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2023-01-31',
              latestPhaseType: 'COMPLETE',
              previousPhases: {
                phase7CompleteDate: '2023-02-08',
              },
            },
            closeDate: '2023-01-31',
            documentsNeeded: false,
            decisionLetterSent: false,
            status: 'COMPLETE',
            supportingDocuments: [],
            trackedItems: [],
          },
        };

        const { container, getByTestId } = render(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
            />
            ,
          </Provider>,
        );
        const filesPage = $('#tabPanelFiles', container);

        expect(filesPage).to.exist;
        expect($('.claim-file-header-container', container)).to.exist;
        expect(getByTestId('additional-evidence-page')).to.exist;
        expect($('.documents-filed-container', container)).to.exist;
        expect($('.claims-requested-files-container', container)).not.to.exist;
      });
    });
  });

  it('should render notification', () => {
    const claim = {};

    const tree = SkinDeep.shallowRender(
      <FilesPage
        loading
        message={{ title: 'Test', body: 'Body' }}
        claim={claim}
      />,
    );
    expect(tree.props.message).not.to.be.null;
  });

  it('should not render children with null claim', () => {
    const claim = null;

    const tree = SkinDeep.shallowRender(
      <FilesPage
        loading
        message={{ title: 'Test', body: 'Body' }}
        claim={claim}
      />,
    );
    expect(tree.props.children).to.be.null;
  });

  it('should hide requested files when closed', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-01-31',
          latestPhaseType: 'COMPLETE',
          previousPhases: {
            phase7CompleteDate: '2023-02-08',
          },
        },
        closeDate: '2023-01-31',
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'COMPLETE',
        supportingDocuments: [],
        trackedItems: [],
      },
    };

    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);

    expect(tree.subTree('RequestedFilesInfo')).to.be.false;
  });

  it('should show requested files when open', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-02-08',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'INTIIAL_REVIEW',
        supportingDocuments: [],
        trackedItems: [],
      },
    };

    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);
    expect(tree.subTree('RequestedFilesInfo')).not.to.be.false;
  });

  it('should render ask va to decide component', () => {
    const claim = {
      id: 1,
      type: 'claim',
      attributes: {
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-03-04',
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
            phase2CompleteDate: '2023-03-04',
          },
        },
        documentsNeeded: false,
        decisionLetterSent: false,
        evidenceWaiverSubmitted5103: false,
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        supportingDocuments: [],
        trackedItems: [],
      },
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage params={{ id: 2 }} claim={claim} />,
    );

    expect(tree.everySubTree('AskVAToDecide')).not.to.be.empty;
  });

  it('should display turned in docs', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-02-08',
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        supportingDocuments: [],
        trackedItems: [
          {
            id: 1,
            status: 'ACCEPTED',
            displayName: 'Test',
            description: 'Test',
            suspenseDate: '2024-02-01',
            date: '2023-01-01',
          },
        ],
      },
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage claim={claim} params={{ id: 1 }} />,
    );
    expect(tree.everySubTree('SubmittedTrackedItem').length).to.equal(1);
  });

  it('should display additional evidence docs', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-02-08',
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        supportingDocuments: [
          {
            id: '1234',
            originalFileName: 'test.pdf',
            documentTypeLabel: 'Buddy / Lay Statement',
            uploadDate: '2023-03-04',
          },
        ],
        trackedItems: [],
      },
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage claim={claim} params={{ id: 1 }} />,
    );
    expect(tree.everySubTree('AdditionalEvidenceItem').length).to.equal(1);
  });

  it('should show never received docs as tracked items', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-02-08',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'INTIIAL_REVIEW',
        supportingDocuments: [],
        trackedItems: [
          {
            id: 1,
            status: 'ACCEPTED',
            displayName: 'Test',
            description: 'Test',
            suspenseDate: '2024-02-01',
            date: '2023-01-01',
          },
          {
            id: 2,
            status: 'INITIAL_REVIEW_COMPLETE',
            displayName: 'Test',
            description: 'Test',
            suspenseDate: '2024-02-01',
            date: '2023-01-01',
          },
        ],
      },
    };

    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);
    expect(tree.everySubTree('SubmittedTrackedItem').length).to.equal(2);
    expect(tree.everySubTree('AdditionalEvidenceItem')).to.be.empty;
  });

  it('should clear alert', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-02-08',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'INTIIAL_REVIEW',
        supportingDocuments: [],
        trackedItems: [],
      },
    };
    const clearNotification = sinon.spy();
    const message = {
      title: 'Test',
      body: 'Test',
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
        clearNotification={clearNotification}
        message={message}
        claim={claim}
      />,
    );
    expect(clearNotification.called).to.be.false;
    tree.subTree('ClaimDetailLayout').props.clearNotification();
    expect(clearNotification.called).to.be.true;
  });

  it('should clear notification when leaving', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-02-08',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'INTIIAL_REVIEW',
        supportingDocuments: [
          {
            id: '123456',
            originalFileName: 'test.pdf',
            documentTypeLabel: 'Buddy / Lay Statement',
            uploadDate: '2023-03-04',
          },
        ],
        trackedItems: [],
      },
    };

    const clearNotification = sinon.spy();
    const message = {
      title: 'Test',
      body: 'Test',
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage
        clearNotification={clearNotification}
        message={message}
        claim={claim}
      />,
    );
    expect(clearNotification.called).to.be.false;
    tree.getMountedInstance().componentWillUnmount();
    expect(clearNotification.called).to.be.true;
  });
});
