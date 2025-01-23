import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NeedHelp from '../components/NeedHelp';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import {
  claimAvailable,
  getClaimType,
  setDocumentTitle,
} from '../utils/helpers';
import Default5103EvidenceNotice from '../components/claim-document-request-pages/Default5103EvidenceNotice';
import { standard5103Item } from '../constants';
// Not currently being used. Was being used on WhatYouNeedToDo and AdditionalEvidence.
// Waiting to see if we still need this component or not
const filesPath = '../files';
const statusPath = '../status';

export function Standard5103NoticePage({ claim, loading }) {
  setDocumentTitle('Review your evidence list (5103 notice)');

  const claimType = getClaimType(claim).toLowerCase();

  const previousPageIsFilesTab = () => {
    const previousPage = sessionStorage.getItem('previousPage');
    return previousPage === 'files';
  };

  const filesBreadcrumb = {
    href: filesPath,
    label: `Files for your ${claimType} claim`,
    isRouterLink: true,
  };
  const statusBreadcrumb = {
    href: statusPath,
    label: `Status of your ${claimType} claim`,
    isRouterLink: true,
  };

  const previousPageBreadcrumb = previousPageIsFilesTab()
    ? filesBreadcrumb
    : statusBreadcrumb;

  const crumbs = [
    previousPageBreadcrumb,
    {
      href: '../5103-evidence-notice',
      label: 'Review evidence list (5103 notice)',
      isRouterLink: true,
    },
  ];

  let content;
  if (loading) {
    content = (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );
  } else if (!claimAvailable(claim)) {
    // Return null if the claim/ claim.attributes dont exist
    content = null;
  } else {
    content = <Default5103EvidenceNotice item={standard5103Item} />;
  }

  return (
    <div>
      <div name="topScrollElement" />
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs crumbs={crumbs} />
          <div>{content}</div>
          <NeedHelp />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const { claimDetail } = claimsState;

  return {
    claim: claimDetail.detail,
    loading: claimDetail.loading,
  };
}

export default connect(mapStateToProps)(Standard5103NoticePage);

Standard5103NoticePage.propTypes = {
  claim: PropTypes.object,
  loading: PropTypes.bool,
};
