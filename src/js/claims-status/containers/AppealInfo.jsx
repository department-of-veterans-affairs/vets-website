import React from 'react';
import PropTypes from 'prop-types';
import AppealsV2StatusPage from './AppealsV2StatusPage';
import AppealsV2DetailPage from './AppealsV2DetailPage';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';

export class AppealInfo extends React.Component {
  render() {
    return (
      <div>
        I'm the AppealInfo container!
        <AppealsV2TabNav appealId={this.props.params.id}/>
        <AppealsV2StatusPage/>
        <AppealsV2DetailPage/>
      </div>
    );
  }
}

AppealInfo.PropTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default AppealInfo;
