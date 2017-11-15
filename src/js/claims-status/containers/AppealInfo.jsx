import React from 'react';
import PropTypes from 'prop-types';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';

const AppealInfo = ({ params, children }) => {
  const appealId = params.id;
  return (
    <div className="row">
      <div className="medium-8 columns">
        <AppealsV2TabNav appealId={appealId}/>
        <div className="va-tab-content va-appeals-content">{children}</div>
      </div>
      {/* This assumes the Need Help sidebar doesn't change for either page */}
    </div>
  );
};

AppealInfo.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  children: PropTypes.object.isRequired
};

export default AppealInfo;
