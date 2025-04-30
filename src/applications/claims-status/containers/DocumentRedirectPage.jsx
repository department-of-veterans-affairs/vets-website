import { Redirect } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withRouter from '../utils/withRouter';

const DocumentRedirect = ({ trackedItem, trackedItemId }) => {
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
  if (!trackedItem || !redirectPath)
    return (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );

  return <Redirect to={redirectPath} />;
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
  )(DocumentRedirect),
);

DocumentRedirect.propTypes = {
  trackedItem: PropTypes.object,
  trackedItemId: PropTypes.string,
};
