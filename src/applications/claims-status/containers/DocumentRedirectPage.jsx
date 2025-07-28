import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import withRouter from '../utils/withRouter';
import DocumentRequestPage from './DocumentRequestPage';

const DocumentRedirectPage = ({ trackedItem, trackedItemId }) => {
  const [redirectPath, setRedirectPath] = useState(null);
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstFriendlyEvidenceRequests = useToggleValue(
    TOGGLE_NAMES.cstFriendlyEvidenceRequests,
  );
  useEffect(
    () => {
      if (!trackedItem) return;
      const fetchEvidenceType = async () => {
        if (trackedItem.status === 'NEEDED_FROM_YOU') {
          setRedirectPath(`../needed-from-you/${trackedItemId}`);
        } else {
          setRedirectPath(`../needed-from-others/${trackedItemId}`);
        }
      };
      if (cstFriendlyEvidenceRequests) {
        fetchEvidenceType();
      }
    },
    [
      cstFriendlyEvidenceRequests,
      trackedItem,
      trackedItem.status,
      trackedItemId,
    ],
  );
  if (!trackedItem)
    return (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );

  return cstFriendlyEvidenceRequests ? (
    <Redirect to={redirectPath} replace />
  ) : (
    <DocumentRequestPage />
  );
};

function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const { claimDetail } = claimsState;
  const { trackedItemId } = ownProps.params;
  let trackedItem = null;
  if (claimDetail.detail) {
    const { trackedItems } = claimDetail.detail.attributes;
    [trackedItem] = trackedItems.filter(
      item => item.id === parseInt(trackedItemId, 10),
    );
  }

  return {
    trackedItem,
    trackedItemId,
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(DocumentRedirectPage),
);

DocumentRedirectPage.propTypes = {
  trackedItem: PropTypes.object,
  trackedItemId: PropTypes.string,
};
