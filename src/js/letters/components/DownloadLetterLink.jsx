import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import { apiRequest } from '../utils/helpers';

const Modernizr = require('modernizr');
if (!Modernizr.bloburls) {
  require('classlist-polyfill'); // DOM element classList support.
}
if (!Modernizr.adownload) {
  require('dataset');  // dataSet accessor support.
}

// const FileSaver = require('file-saver');

class DownloadLetterLink extends React.Component {
  constructor(props) {
    super(props);
    this.downloadLetter = this.downloadLetter.bind(this);
  }

  downloadLetter() {
    // When this.props.letterType is 'benefit_summary' or 'dependent_benefit_summary'
    // pass in benefit summary options as URL parameters

    const requestUrl = `/v0/letters/${this.props.letterType}`;
    const ie10 = !!window.navigator.msSaveOrOpenBlob;

    let downloadWindow;
    if (!ie10) {
      downloadWindow = window.open();
    }

    // TODO: in addition to the new blank browser window, this tries to
    // pop up a duplicate window which may or may not be suppressed
    // by the user's browser content settings. Need to test manually on
    // multiple browsers before launching.
    apiRequest(
      requestUrl,
      { method: 'POST' },
      response => {
        response.blob().then(blob => {
          // Blob URLs are not supported on Opera Mini or IE10 and below
          const urlObj = window.URL || window.webkitURL;
          const downloadUrl = urlObj.createObjectURL(blob);
          const blobSupported = !!(/^blob:/.exec(downloadUrl));
          if (blobSupported) {
            // This is hack to give the file a nice name instead of an
            // ugly hash, but is not supported on IE11 or iOS Safari.
            const link = document.createElement('a');
            if (typeof link.download !== 'undefined') {
              document.body.appendChild(link);
              link.style = 'display: none';
              link.href = downloadUrl;
              link.target = '_blank';
              link.download = this.props.letterName;
              link.click();
            } else {
              downloadWindow.location.href = downloadUrl;
            }
            document.body.removeChild(link);
          } else if (ie10) {
            window.navigator.msSaveOrOpenBlob(blob, this.props.letterName);
          } else {
            // What should we do about Opera Mini?
          }
          urlObj.revokeObjectURL(downloadUrl);
        });
      });
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
