import React from 'react';
import { Link } from 'react-router';
import { itemsNeedingAttentionFromVet } from '../utils/helpers';

class NeedFilesFromYou extends React.Component {
  render() {
    const filesNeeded = itemsNeedingAttentionFromVet(this.props.events);
    return (
      <div className="usa-alert usa-alert-warning claims-alert claims-alert-status need-files-alert">
        <div className="usa-alert-body item-title-container">
          <h4 className="usa-alert-heading">{filesNeeded} {filesNeeded === 1 ? 'item needs' : 'items need'} your attention</h4>
        </div>
        <Link to={`your-claims/${this.props.claimId}/files`} className="usa-button view-details-button">View Details</Link>
        <div className="clearfix"></div>
      </div>
    );
  }
}

NeedFilesFromYou.propTypes = {
  events: React.PropTypes.array.isRequired
};

export default NeedFilesFromYou;
