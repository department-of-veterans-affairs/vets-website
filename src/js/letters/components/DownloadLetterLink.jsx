import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getLetterPdf } from '../actions/letters';

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
    this.props.getLetterPdf(this.props.letterType, this.props.letterName, this.props.letterOptions);
  }

  render() {
    let buttonClasses;
    let buttonText;
    let buttonDisabled;
    switch (this.props.downloadStatus) {
      case 'downloading':
        buttonClasses = 'usa-button-disabled';
        buttonText = 'Downloading...';
        buttonDisabled = true;
        break;
      case 'success':
        buttonClasses = 'usa-button-primary va-button-primary';
        buttonText = 'Downloaded';
        buttonDisabled = false;
        break;
      case 'failure':
        buttonClasses = 'usa-button-disabled';
        buttonText = 'Failed to download';
        buttonDisabled = true;
        break;
      default:
        buttonClasses = 'usa-button-primary va-button-primary';
        buttonText = 'Download Letter';
        buttonDisabled = false;
    }

    return (
      <div className="download-button">
        <button onClick={this.downloadLetter}
            disabled={buttonDisabled}
            className={buttonClasses}>
          {buttonText}
        </button>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    letterType: ownProps.letterType,
    letterName: ownProps.letterName,
    downloadStatus: ownProps.downloadStatus,
    letterOptions: state.letters.requestOptions
  };
}

DownloadLetterLink.PropTypes = {
  letterType: PropTypes.string.required,
  letterName: PropTypes.string.required,
  downloadStatus: PropTypes.string
};

const mapDispatchToProps = {
  getLetterPdf
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadLetterLink);

