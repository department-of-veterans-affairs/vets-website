import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

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
    return (
      <Link onClick={this.downloadLetter} to="/" target="_blank"
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
    letterOptions: state.letters.requestOptions
  };
}

DownloadLetterLink.PropTypes = {
  letterType: PropTypes.string.required,
  letterName: PropTypes.string.required
};

const mapDispatchToProps = {
  getLetterPdf
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadLetterLink);

