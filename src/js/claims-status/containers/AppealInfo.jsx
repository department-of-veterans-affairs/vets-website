import React from 'react';
import PropTypes from 'prop-types';
import AppealsV2StatusPage from './AppealsV2StatusPage';
import AppealsV2DetailPage from './AppealsV2DetailPage';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';

const PATHS = { status: 'status', detail: 'detail' };

const setActiveTab = (currentPath, paths = { status: '', detail: '' }, appealId) => {
  if (currentPath.includes(paths.status)) {
    return <AppealsV2StatusPage appealId={appealId}/>;
  } else if (currentPath.includes(paths.detail)) {
    return <AppealsV2DetailPage appealId={appealId}/>;
  }
  return <AppealsV2StatusPage appealId={appealId}/>;
};

export const AppealInfo = (props) => {
  const appealId = props.params.id;
  const currentPath = props.route.path;
  const activeTabContent = setActiveTab(currentPath, PATHS, appealId);
  return (
    <div>
      I'm the AppealInfo container!
      <AppealsV2TabNav appealId={appealId}/>
      {activeTabContent}
    </div>
  );
};

AppealInfo.PropTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default AppealInfo;
