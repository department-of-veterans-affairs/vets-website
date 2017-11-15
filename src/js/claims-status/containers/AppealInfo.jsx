import React from 'react';
import PropTypes from 'prop-types';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';

const AppealInfo = ({ params, children }) => {
  const appealId = params.id;
  return (
    <div>
      <AppealsV2TabNav appealId={appealId}/>
      {children}
    </div>
  );
};

AppealInfo.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  children: PropTypes.object.isRequired
};

export default AppealInfo;
