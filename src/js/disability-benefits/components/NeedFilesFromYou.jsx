import React from 'react';
import { Link } from 'react-router';

class NeedFilesFromYou extends React.Component {
  render() {
    const filesNeeded = this.props.events.filter(event => event.status === 'NEEDED' && event.type === 'still_need_from_you_list').length;
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
