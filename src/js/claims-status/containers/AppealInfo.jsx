import React from 'react';
import PropTypes from 'prop-types';
import AppealsV2StatusPage from './AppealsV2StatusPage';
import AppealsV2DetailPage from './AppealsV2DetailPage';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';

const PATHS = { status: 'status', detail: 'detail' };

const getActiveTab = (currentPath, pathOptions = { status: '', detail: '' }, appealId) => {
  if (currentPath.includes(pathOptions.status)) {
    return <AppealsV2StatusPage appealId={appealId}/>;
  } else if (currentPath.includes(pathOptions.detail)) {
    return <AppealsV2DetailPage appealId={appealId}/>;
  }
  return <AppealsV2StatusPage appealId={appealId}/>;
};

export class AppealInfo extends React.Component {
  render() {
    const appealId = this.props.params.id;
    const currentPath = this.props.route.path;
    const activeTabContent = getActiveTab(currentPath, PATHS, appealId);
    return (
      <div>
        I'm the AppealInfo container!
        <AppealsV2TabNav appealId={appealId}/>
        {activeTabContent}
      </div>
    );
  }
}

AppealInfo.PropTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default AppealInfo;
