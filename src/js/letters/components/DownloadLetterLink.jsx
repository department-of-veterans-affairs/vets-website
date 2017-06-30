import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import { apiRequest } from '../utils/helpers';

class DownloadLetterLink extends React.Component {
  constructor(props) {
    super(props);
    this.downloadLetter = this.downloadLetter.bind(this);
  }

  // This opens a duplicate window for some inexplicable reason,
  // possibly related to some blob response nuance.
  /*
  downloadLetter() {
    const requestUrl = `/v0/letters/${this.props.letterType}`;
    apiRequest(
      requestUrl,
      { method: 'POST' },
      response => {
        response.blob().then(blob => {
        });
      });
  */

  // This opens a new duplicate window, focuses on it, and then opens
  // the PDF in the original window (so it appears in the browser tab to
  // the left of the current tab, which is weird.
  /*
  downloadLetter() {
    const requestUrl = `/v0/letters/${this.props.letterType}`;
    apiRequest(
      requestUrl,
      { method: 'POST' },
      response => {
        response.blob().then(blob => {
          window.URL = window.URL || window.webkitURL;
          const downloadUrl = window.URL.createObjectURL(blob);
          window.location.href = downloadUrl;
        });
      });
  }
  */

  // This opens a new blank window and renders the pdf in it (to the
  // right of the current browser as expected, but also tries to open
  // a window from the original window as above (which may be blocked
  // by the popup blocker, or if not blocked will pop up an extra window
  // for no apparent reason).
  downloadLetter() {
    window.dataLayer.push({
      event: 'letter-download',
      'letter-type': this.props.letterType
    });
    const requestUrl = `/v0/letters/${this.props.letterType}`;
    const downloadWindow = window.open();
    apiRequest(
      requestUrl,
      { method: 'POST' },
      response => {
        response.blob().then(blob => {
          const URLobj = window.URL || window.webkitURL;
          // const URLobj = downloadWindow.URL || downloadWindow.webkitURL;
          const downloadUrl = URLobj.createObjectURL(blob);
          downloadWindow.location.href = downloadUrl;
        });
      });
  }

  // This is a longer solution that handles various browsers and also
  // gives the file a nicer name, but does not render it in a window.
  // Instead, it opens a blank window and downloads the nicely named
  // file. It suffers from the same issue above that it attempts to
  // open an extra duplicate window. This should be manually tested on
  // multiple browsers before launching.
  /*
  downloadLetter() {
    const requestUrl = `/v0/letters/${this.props.letterType}`;
    const ie10 = !!window.navigator.msSaveOrOpenBlob;
    let downloadWindow;
    if (!ie10) {
      downloadWindow = window.open();
    }

    // TODO: in addition to the new blank browser window, this tries to
    // pop up a duplicate window which may or may not be suppressed
    // by the user's browser content settings.
    apiRequest(
      requestUrl,
      { method: 'POST' },
      response => {
        response.blob().then(blob => {
          if (ie10) {
            window.navigator.msSaveOrOpenBlob(blob, this.props.letterName);
            return Promise.resolve();
          }
          window.URL = window.URL || window.webkitURL;
          const downloadUrl = window.URL.createObjectURL(blob);
          // Make sure blob URLs are supported
          const blobSupported = !!(/^blob:/.exec(downloadUrl));
          if (blobSupported) {
            // Try to give the file a nice name instead of an ugly hash
            // by creating a new link element and setting its download attribute.
            const link = document.createElement('a');
            if (typeof link.download !== 'undefined') {
              document.body.appendChild(link);
              // downloadWindow.document.body.appendChild(link);
              link.style = 'display: none';
              link.target = '_blank';
              link.href = downloadUrl;
              link.download = this.props.letterName;
              link.click();
            } else {
              // The download attribute is not supported on IE11 or
              // iOS Safari, so live with the ugly hash name.
              downloadWindow.location.href = downloadUrl;
            }
            // document.body.removeChild(link);
            // urlObj.revokeObjectURL(downloadUrl);
            return Promise.resolve();
          }
          // Make sure this gets to sentry
          return Promise.reject(new Error('Cannot download pdf blob'));
        });
      });
  }
  */

  render() {
    return (
      <Link
          onClick={this.downloadLetter}
          to="/" target="_blank"
          className="usa-button-primary va-button-primary">
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
