import React from 'react';
import PropTypes from 'prop-types';
import Issues from '../components/appeals-v2/Issues';
import { APPEAL_TYPES, addStatusToIssues } from '../utils/appeals-v2-helpers';

const AppealsV2DetailPage = ({ appeal }) => {
  const issues = addStatusToIssues(appeal.attributes.issues);
  const isAppeal =
    appeal.type === APPEAL_TYPES.appeal || appeal.type === APPEAL_TYPES.legacy;
  return (
    <div aria-labelledby="tabv2detail" id="tabPanelv2detail" role="tabpanel">
      <Issues issues={issues} isAppeal={isAppeal} />
    </div>
  );
};

AppealsV2DetailPage.propTypes = {
  appeal: PropTypes.shape({
    attributes: PropTypes.shape({
      events: PropTypes.array,
      alerts: PropTypes.array,
      status: PropTypes.shape({
        type: PropTypes.string,
        details: PropTypes.object,
      }).isRequired,
    }).isRequired,
  }),
};

export default AppealsV2DetailPage;
