import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { FilesPage } from '../../containers/FilesPage';
import * as AdditionalEvidencePage from '../../components/claim-files-tab/AdditionalEvidencePage';
import { renderWithRouter } from '../utils';

const getStore = (cst5103UpdateEnabled = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_5103_update_enabled: cst5103UpdateEnabled,
    },
  }));

const props = {
  claim: {},
  clearNotification: () => {},
  lastPage: '',
  loading: false,
  message: {},
};

describe('<FilesPage>', () => {
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

  it('should render loading state', () => {
    const { container } = renderWithRouter(
      <FilesPage
        {...props}
        loading
        message={{ title: 'Test', body: 'Body' }}
      />,
    );
    expect($('.claim-files', container)).to.not.exist;
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render null when claim empty', () => {
    const { container, getByText } = renderWithRouter(
      <FilesPage {...props} message={{ title: 'Test', body: 'Body' }} />,
    );

    expect($('.claim-files', container)).to.not.exist;
    expect(document.title).to.equal('Files For Your Claim | Veterans Affairs');
    getByText('Claim status is unavailable');
  });

  it('should render null when claim null', () => {
    const { container, getByText } = renderWithRouter(
      <FilesPage
        {...props}
        claim={null}
        message={{ title: 'Test', body: 'Body' }}
      />,
    );

    expect($('.claim-files', container)).to.not.exist;
    expect(document.title).to.equal('Files For Your Claim | Veterans Affairs');
    getByText('Claim status is unavailable');
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
        status: 'INITIAL_REVIEW',
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
        status: 'INITIAL_REVIEW',
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

      const { container, getByTestId } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage
            claim={claim}
            message={{ title: 'Test', body: 'Body' }}
            clearNotification={() => {}}
          />
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
          documentsNeeded: true,
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
      const { container, getByTestId } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage
            claim={claim}
            message={{ title: 'Test', body: 'Body' }}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const filesPage = $('#tabPanelFiles', container);

      expect(filesPage).to.exist;
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect($('.documents-filed-container', container)).to.exist;
      expect($('.claims-requested-files-container', container)).to.not.exist;
    });

    context('when cst5103UpdateEnabled feature flag is disabled', () => {
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

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
            />
          </Provider>,
        );

        getByText('Ask for your Claim Decision');
      });
    });

    context('when cst5103UpdateEnabled feature flag is enabled', () => {
      it('should not render ask va to decide component', () => {
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

        const { queryByText } = renderWithRouter(
          <Provider store={getStore(true)}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
            />
          </Provider>,
        );

        expect(queryByText('Ask for your Claim Decision')).to.not.exist;
      });
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

      const { container, getByTestId } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage
            claim={claim}
            message={{ title: 'Test', body: 'Body' }}
            clearNotification={() => {}}
          />
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
