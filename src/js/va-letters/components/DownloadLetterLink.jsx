import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import { apiRequest } from '../utils/helpers';

class DownloadLetterLink extends React.Component {
  constructor(props) {
    super(props);
    this.downloadLetter = this.downloadLetter.bind(this);
  }

  downloadLetter() {
    const ie10 = window.navigator.msSaveOrOpenBlob;

    // Open window outside of the fetch response or it will be suppressed by pop-up blockers
    let downloadWindow;
    if (!ie10) {
      downloadWindow = window.open(this.downloadUrl, '_blank');
    }

    // When this.props.letterType is 'benefit_summary' or 'dependent_benefit_summary'
    // use { method: 'POST' } and pass in benefit summary options as URL parameters

    // Note that the mock service only has a 'commissary' letter type
    const requestUrl = `/v0/letters/${this.props.letterType}`;
    apiRequest(
      requestUrl,
      null,
      response => {
        response.blob().then(blob => {
          if (ie10) {
            // May want to include timestamp and/or first/last name in filename
            window.navigator.msSaveOrOpenBlob(blob, `${this.props.letterName}`);
          } else { // Chrome/Firefox/Opera
            // Figure out how to get a nicer URL for this, or use something other than createObjectURL()
            const downloadUrl = URL.createObjectURL(blob);
            downloadWindow.location.href = downloadUrl;
          }
          // Test/figure out what to do for Safari and for older IE versions
          // https://github.com/department-of-veterans-affairs/vets.gov-team/issues/3465
        });
      }
    );

    // If we use createObjectURL(), At some point call revokeObjectURL() to free memory
  }

  render() {
    return (
      <Link onClick={this.downloadLetter} to="/" target="_blank" className="usa-button-primary va-button-primary">
        Download Letter
      </Link>
    );
  }
}

DownloadLetterLink.PropTypes = {
  letterType: PropTypes.string.required,
  letterName: PropTypes.string.required
};

export default DownloadLetterLink;
