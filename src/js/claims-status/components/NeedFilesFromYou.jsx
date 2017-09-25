import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

class NeedFilesFromYou extends React.Component {
  render() {
    const files = this.props.files;
    return (
      <div className="usa-alert usa-alert-warning claims-alert claims-alert-status need-files-alert">
        <div className="usa-alert-body item-title-container">
          <h4 className="usa-alert-heading">{files} {files === 1 ? 'item needs' : 'items need'} your attention</h4>
        </div>
        <Link
          aria-label="View details about items that need your attention"
          title="View details about items that need your attention"
          to={`your-claims/${this.props.claimId}/files`}
          className="usa-button view-details-button">View Details</Link>
        <div className="clearfix"></div>
      </div>
    );
  }
}

NeedFilesFromYou.propTypes = {
  files: PropTypes.number.isRequired
};

export default NeedFilesFromYou;
