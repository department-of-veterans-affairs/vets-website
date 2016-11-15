import React from 'react';
import { Link } from 'react-router';

import DueDate from '../components/DueDate';
import { truncateDescription } from '../utils/helpers';

export default class RequestedFilesInfo extends React.Component {
  render() {
    const { id, waiverSubmitted, filesNeeded, optionalFiles } = this.props;

    return (
      <div className="claims-requested-files-container">
        <div className="file-request-list">
          <h4 className="hightlight claim-file-border">File requests</h4>

          {filesNeeded.length + optionalFiles.length === 0
            ? <div className="no-documents"><p>You don't need to turn in any documents to VA.</p></div>
            : null}

          {filesNeeded.map(item => (
            <div className="file-request-list-item usa-alert usa-alert-warning claims-no-icon" key={item.trackedItemId}>
              <div className="item-container">
                <h5 className="file-request-title">{item.displayName}</h5>
                <p>{truncateDescription(item.description)}</p>
                <DueDate date={item.suspenseDate}/>
              </div>
              <Link aria-label={`View Details for ${item.displayName}`} title={`View Details for ${item.displayName}`} className="usa-button usa-button-outline view-details-button" to={`your-claims/${id}/document-request/${item.trackedItemId}`}>View Details</Link>
              <div className="clearfix"></div>
            </div>
          ))}

          {optionalFiles.map(item => (
            <div className="file-request-list-item usa-alert file-request-list-item-optional claims-no-icon" key={item.trackedItemId}>
              <div className="item-container">
                <h5 className="file-request-title">{item.displayName}</h5>
                <p>{truncateDescription(item.description)}</p>
                <div className="claims-optional-desc"><h6>Optional</h6> - we requested this from others, but you may upload it if you have it.</div>
              </div>
              <Link aria-label={`View Details for ${item.displayName}`} title={`View Details for ${item.displayName}`} className="usa-button usa-button-outline view-details-button" to={`your-claims/${id}/document-request/${item.trackedItemId}`}>View Details</Link>
              <div className="clearfix"></div>
            </div>
          ))}
        </div>

        <div className="submit-file-container">
          <div className="submit-additional-evidence">
            <h4 className="hightlight claim-file-border">Turn in more evidence</h4>
            {waiverSubmitted
              ?
              <div className="va-to-make-decision">
                <p>You asked VA to make a decision on your claims based on the evidence you filed. You don't have to do anything else.</p>
              </div>
              :
              <div className="usa-alert additional-evidence-alert">
                <div className="item-container">
                  <p>Do you have additional evidence to submit in order to support your claim? Upload it here now.</p>
                </div>
                <Link aria-label="View details for additional evidence" title="View details for additional evidence" className="usa-button usa-button-outline view-details-button" to={`your-claims/${id}/turn-in-evidence`}>View Details</Link>
                <div className="clearfix"></div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

RequestedFilesInfo.propTypes = {
  id: React.PropTypes.string.isRequired,
  waiverSubmitted: React.PropTypes.bool.isRequired,
  filesNeeded: React.PropTypes.array.isRequired,
  optionalFiles: React.PropTypes.array.isRequired
};
