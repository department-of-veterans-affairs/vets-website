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
              latestPhaseType: 'Complete',
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
});
