import React from 'react';
import { connect } from 'react-redux';

export class DownloadPage extends React.Component {
  render() {
    const data = {
      requestDate: 'Jan 20, 2017 14:09 EST',
      status: <span className="bb-status-ready">Ready to download</span>,
      pdfFileSize: '124 KB',
      pdfActions: (
        <div>
          <button>Download PDF</button>
          <button className="usa-button-outline">
            View/Print PDF
          </button>
        </div>
      ),
      txtFileSize: '20 KB',
      txtActions: (
        <div>
          <button>Download Text</button>
          <button className="usa-button-outline">
            View/Print Text
          </button>
        </div>
      )
    };

    return (
      <div>
        <h1>Download Your Health Records</h1>
        <p>Here are the health records in two file formats based on your request.</p>
        <table className="bb-download-table usa-table-borderless">
          <thead>
            <tr>
              <th>Request Date</th>
              <th>Status</th>
              <th>File Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.requestDate}</td>
              <td>{data.status}</td>
              <td>{data.pdfFileSize}</td>
              <td>{data.pdfActions}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>{data.txtFileSize}</td>
              <td>{data.txtActions}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
