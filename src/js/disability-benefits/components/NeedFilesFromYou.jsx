import React from 'react';

class NeedFilesFromYou extends React.Component {
  render() {
    return (
      <div className="need-files-from-you usa-alert usa-alert-warning claims-no-icon">
        <h4 className="warning-title"><i className="fa fa-exclamation-triangle"></i>We need 2 files from you</h4>
        <button className="va-button-secondary">View Details</button>
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default NeedFilesFromYou;
