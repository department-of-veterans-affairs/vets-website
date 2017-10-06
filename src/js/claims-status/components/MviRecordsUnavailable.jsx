import React from 'react';

class MviRecordsUnavailable extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning no-background-image claims-unavailable">
        <h4 className="claims-alert-header">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;We weren’t able to find your records
        </h4>
          Please call 1-855-574-7286 between Monday - Friday, 8:00 a.m. - 8:00 p.m. ET.
      </div>
    );
  }
}

export default MviRecordsUnavailable;
