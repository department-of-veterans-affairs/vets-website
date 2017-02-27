import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AlertBox from '../../common/components/AlertBox';

import DownloadLink from '../components/DownloadLink';

export class DownloadPage extends React.Component {
  renderMessageBanner() {
    const alertProps = {
      isVisible: true,
    };
    if (this.props.refresh && this.props.refresh.statuses.ERROR.length > 0) {
      alertProps.content = (
        <div>
          <h4>Your health records are not up to date</h4>
          <p>
            This older version of your health records may have outdated or missing information.
          </p>
        </div>
      );
      alertProps.status = 'warning';
    } else {
      alertProps.content = (
        <div>
          <h4>Your records are ready to download</h4>
          <p>
            For security, your health records will only be available for download for 30 minutes. After that, or if you close this page, you'll have to start a new request to get your records.
          </p>
        </div>
      );
      alertProps.status = 'success';
    }

    return <AlertBox {...alertProps}/>;
  }

  render() {
    const data = {
      requestDate: 'Jan 20, 2017 14:09 EST',
    };

    return (
      <div>
        <h1>Download Your Health Records</h1>
        {this.renderMessageBanner()}
        <p>
          <strong>Request Date:</strong> {data.requestDate}
        </p>
        <div>
          <DownloadLink name="PDF File" docType="pdf"/>
          <DownloadLink name="Text File" docType="txt"/>
        </div>
        <p>
          <Link to="/">Start a new request</Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const hrState = state.health.hr;

  return {
    refresh: hrState.refresh,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
