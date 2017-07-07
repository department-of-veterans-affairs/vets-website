import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import { apiRequest } from '../utils/helpers';

export class DownloadLetterLink extends React.Component {
  constructor(props) {
    super(props);
    this.downloadLetter = this.downloadLetter.bind(this);
  }

  // Either download the pdf or open it in a new window, depending on the
  // browser. Needs to be manually tested on a variety of
  // vets.gov-supported platforms, particularly iOS/Safari
  downloadLetter(e) {
    e.preventDefault();
    window.dataLayer.push({
      event: 'letter-download',
      'letter-type': this.props.letterType
    });

    const requestUrl = `/v0/letters/${this.props.letterType}`;

    // Temporarily suppress sending request body for usability testing purposes.
    const settings = { method: 'POST' };
    /*
    let settings;
    if (this.props.letterType === 'benefit_summary') {
      settings = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.props.letterOptions)
      };
    } else {
      settings = {
        method: 'POST'
      };
    }
    */

    // We handle IE10 separately but assume all other vets.gov-supported
    // browsers have blob URL support.
    // TODO: possibly want to explicitly
    // check for blob URL support with something like
    // const blobSupported = !!(/^blob:/.exec(downloadUrl));
    const ie10 = !!window.navigator.msSaveOrOpenBlob;
    const save = document.createElement('a');
    let downloadWindow;
    const downloadSupported = typeof save.download !== 'undefined';
    if (!downloadSupported) {
      // Instead of giving the file a readable name and downloading
      // it directly, open it in a new window with an ugly hash URL
      downloadWindow = window.open();
    }
    let downloadUrl;

    apiRequest(
      requestUrl,
      settings,
      response => {
        response.blob().then(blob => {
          if (ie10) {
            window.navigator.msSaveOrOpenBlob(blob, this.props.letterName);
          } else {
            window.URL = window.URL || window.webkitURL;
            downloadUrl = window.URL.createObjectURL(blob);
            if (downloadSupported) {
              // Give the file a readable name if the download attribute
              // is supported.
              save.download = this.props.letterName;
              save.href = downloadUrl;
              save.target = '_blank';
              document.body.appendChild(save);
              save.click();
              document.body.removeChild(save);
            } else {
              downloadWindow.location.href = downloadUrl;
            }
          }
        });
      });
    window.URL.revokeObjectURL(downloadUrl);
  }

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

function mapStateToProps(state, ownProps) {
  return {
    letterType: ownProps.letterType,
    letterName: ownProps.letterName,
    letterOptions: state.letters.optionsToInclude
  };
}

DownloadLetterLink.PropTypes = {
  letterType: PropTypes.string.required,
  letterName: PropTypes.string.required
};

export default connect(mapStateToProps)(DownloadLetterLink);

