import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom-v5-compat';
import withRouter from '../utils/withRouter';

const DocumentRedirectPage = ({ trackedItem, trackedItemId }) => {
  const [redirectPath, setRedirectPath] = useState(null);

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
      fetchEvidenceType();
    },
    [trackedItem, trackedItem.status, trackedItemId],
  );
  if (!trackedItem)
    return (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );

  return <Navigate to={redirectPath} replace />;
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
