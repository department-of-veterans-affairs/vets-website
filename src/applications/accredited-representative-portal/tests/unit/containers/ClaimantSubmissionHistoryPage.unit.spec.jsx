import React from 'react';
import { expect } from 'chai';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from '~/platform/site-wide/feature-toggles/actionTypes';
import ClaimantSubmissionHistoryPage from '../../../containers/ClaimantSubmissionHistoryPage';
import { renderTestApp } from '../helpers';

const renderPage = (featureEnabled = true, claimantId = '123') => {
  return renderTestApp(
    <ClaimantSubmissionHistoryPage claimantId={claimantId} />,
    {
      initAction: {
        type: FETCH_TOGGLE_VALUES_SUCCEEDED,
        payload: {
          // eslint-disable-next-line camelcase
          accredited_representative_portal_claimant_details: featureEnabled,
        },
      },
    },
  );
};

describe('ClaimantSubmissionHistoryPage', () => {
  it('can import ClaimantSubmissionHistoryPage module', () => {
    const ClaimantSubmissionHistoryPageModule = require('../../../containers/ClaimantSubmissionHistoryPage');
    expect(ClaimantSubmissionHistoryPageModule).to.exist;
    expect(ClaimantSubmissionHistoryPageModule.default).to.be.a('function');
  });

  it('renders the submission history heading', () => {
    const { getByText } = renderPage();
    expect(getByText('Submission history')).to.exist;
  });

  it('renders the intro text', () => {
    const { getByText } = renderPage();
    expect(getByText(/This list shows all submissions sent through the portal/))
      .to.exist;
  });

  it('renders the submit form link', () => {
    const { container } = renderPage();
    const linkAction = container.querySelector('va-link-action');
    expect(linkAction).to.exist;
    expect(linkAction.getAttribute('href')).to.equal(
      '/representative/submissions',
    );
    expect(linkAction.getAttribute('text')).to.equal('Submit form');
  });

  it('renders the no submissions found message', () => {
    const { getByText } = renderPage();
    expect(getByText('No submissions found.')).to.exist;
  });

  it('renders breadcrumbs', () => {
    const { container } = renderPage();
    const breadcrumbs = container.querySelector('va-breadcrumbs');
    expect(breadcrumbs).to.exist;
    expect(breadcrumbs.getAttribute('label')).to.equal(
      'submission history breadcrumb',
    );
  });

  it('renders claimant name in wrapper', () => {
    const { getByText } = renderPage();
    expect(getByText('lastName, firstName')).to.exist;
  });
});
