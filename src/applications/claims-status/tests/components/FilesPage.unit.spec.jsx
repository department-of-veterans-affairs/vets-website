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

describe('<FilesPage>', () => {
  context('cstUseClaimDetailsV2 feature flag enabled', () => {
    const getStore = (cstUseClaimDetailsV2Enabled = true) =>
      createStore(() => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
        },
      }));

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
      it('should render files page, showing additional evidence section without alerts, and docs filed section when using lighthouse', () => {
        const claim = {
          id: '1',
          attributes: {
            supportingDocuments: [],
            claimDate: '2023-01-01',
            closeDate: null,
            documentsNeeded: false,
            decisionLetterSent: false,
            status: 'INITIAL_REVIEW',
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2015-01-01',
              latestPhaseType: 'INITIAL_REVIEW',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
                phase2CompleteDate: '2023-02-08',
              },
            },
            trackedItems: [],
          },
        };
        const { container, getByTestId } = render(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
              useLighthouse
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
          attributes: {
            supportingDocuments: [],
            claimDate: '2023-01-01',
            closeDate: null,
            documentsNeeded: false,
            decisionLetterSent: false,
            status: 'INITIAL_REVIEW',
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2015-01-01',
              latestPhaseType: 'INITIAL_REVIEW',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
                phase2CompleteDate: '2023-02-08',
              },
            },
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
              useLighthouse
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

      it('should render files page with an EvidenceAlerts section without alerts when using evss', () => {
        const claim = {
          id: '1',
          attributes: {
            open: true,
            phase: 3,
            dateFiled: '2023-01-01',
            documentsNeeded: true,
            decisionLetterSent: false,
            eventsTimeline: [],
          },
        };
        const { container, getByTestId } = render(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
              params={{ id: '1' }}
            />
            ,
          </Provider>,
        );
        const filesPage = $('#tabPanelFiles', container);

        expect(filesPage).to.exist;
        expect($('.claim-file-header-container', container)).to.not.exist;
        expect(getByTestId('additional-evidence-page')).to.exist;
        expect($('.documents-filed-container', container)).to.not.exist;
        expect($('.claims-requested-files-container', container)).to.not.exist;
      });

      it('should render files page with an EvidenceAlerts section with alerts when using evss', () => {
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
        const { container, getByTestId } = render(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
              params={{ id: '1' }}
            />
            ,
          </Provider>,
        );
        const filesPage = $('#tabPanelFiles', container);

        expect(filesPage).to.exist;
        expect($('.claim-file-header-container', container)).to.not.exist;
        expect(getByTestId('additional-evidence-page')).to.exist;
        expect($('.documents-filed-container', container)).to.not.exist;
        expect($('.claims-requested-files-container', container)).not.to.exist;
      });
    });

    context('when claim is closed', () => {
      it('should render files page, showing additional evidence section, and docs filed section when using lighthouse', () => {
        const claim = {
          id: '1',
          attributes: {
            supportingDocuments: [],
            claimDate: '2023-01-01',
            closeDate: '2023-01-31',
            documentsNeeded: false,
            decisionLetterSent: false,
            status: 'COMPLETE',
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2023-01-31',
              latestPhaseType: 'Complete',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
                phase2CompleteDate: '2023-02-08',
              },
            },
            trackedItems: [],
          },
        };
        const { container, getByTestId } = render(
          <Provider store={getStore()}>
            <FilesPage
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
              useLighthouse
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
      attributes: {
        open: false,
        eventsTimeline: [],
      },
    };
    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);

    expect(tree.subTree('RequestedFilesInfo')).to.be.false;
  });

  it('should show requested files when open', () => {
    const claim = {
      attributes: {
        open: true,
        eventsTimeline: [],
      },
    };
    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);
    const content = tree.dive(['FilesPageContent']);
    expect(content.subTree('RequestedFilesInfo')).not.to.be.false;
  });

  it('should render ask va to decide component', () => {
    const claim = {
      id: 1,
      attributes: {
        phase: 3,
        documentsNeeded: false,
        decisionLetterSent: false,
        waiverSubmitted: false,
        eventsTimeline: [
          {
            type: 'still_need_from_you_list',
            status: 'NEEDED',
          },
        ],
      },
    };

    const tree = SkinDeep.shallowRender(
      <FilesPage params={{ id: 2 }} claim={claim} />,
    );
    const content = tree.dive(['FilesPageContent']);
    expect(content.everySubTree('AskVAToDecide')).not.to.be.empty;
  });

  it('should display turned in docs', () => {
    const claim = {
      attributes: {
        eventsTimeline: [
          {
            type: 'received_from_you_list',
            documents: [
              {
                filename: 'Filename',
              },
            ],
            trackedItemId: 2,
            status: 'ACCEPTED',
          },
        ],
      },
    };

    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);
    const content = tree.dive(['FilesPageContent']);
    expect(content.everySubTree('SubmittedTrackedItem').length).to.equal(1);
  });

  it('should display additional evidence docs', () => {
    const claim = {
      attributes: {
        eventsTimeline: [
          {
            filename: 'Filename',
            fileType: 'Testing',
            type: 'other_documents_list',
          },
        ],
      },
    };

    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);
    const content = tree.dive(['FilesPageContent']);
    expect(content.everySubTree('AdditionalEvidenceItem').length).to.equal(1);
  });

  it('should show never received docs as tracked items', () => {
    const claim = {
      attributes: {
        eventsTimeline: [
          {
            type: 'never_received_from_you_list',
            documents: [
              {
                filename: 'Filename',
              },
            ],
            trackedItemId: 2,
            status: 'ACCEPTED',
          },
          {
            type: 'never_received_from_others_list',
            documents: [
              {
                filename: 'Filename',
              },
            ],
            trackedItemId: 3,
            status: 'NEEDED',
          },
        ],
      },
    };

    const tree = SkinDeep.shallowRender(<FilesPage claim={claim} />);
    const content = tree.dive(['FilesPageContent']);
    expect(content.everySubTree('SubmittedTrackedItem').length).to.equal(2);
    expect(content.everySubTree('AdditionalEvidenceItem')).to.be.empty;
  });

  it('should clear alert', () => {
    const claim = {
      attributes: {
        eventsTimeline: [],
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
      attributes: {
        eventsTimeline: [],
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
