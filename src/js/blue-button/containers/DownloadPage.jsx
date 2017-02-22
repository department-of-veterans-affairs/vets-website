import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import DownloadLink from '../components/DownloadLink';

export class DownloadPage extends React.Component {
  render() {
    const data = {
      requestDate: 'Jan 20, 2017 14:09 EST',
      status: <span className="bb-status-ready">Ready to download</span>,
    };

    return (
      <div>
        <h1>Download Your Health Records</h1>
        {data.status}
        <p>
          <strong>Request Date:</strong> {data.requestDate}
        </p>
        <div>
          <DownloadLink name="PDF File" docType="pdf"/>
          <DownloadLink name="Text File" docType="txt"/>
        </div>
        <p>
          <Link to="/blue-button">Start a new request</Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
