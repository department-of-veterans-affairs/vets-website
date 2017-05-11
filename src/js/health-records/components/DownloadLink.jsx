import PropTypes from 'prop-types';
import React from 'react';

import { apiRequest } from '../utils/helpers';

class DownloadLink extends React.Component {
  constructor(props) {
    super(props);
    this.downloadHealthRecord = this.downloadHealthRecord.bind(this);
    this.downloadUrl = null;
    this.state = { downloading: false };
  }

  downloadHealthRecord(e, stopPropagation = true) {
    e.preventDefault();

    if (this.props.onClick && stopPropagation) {
      this.props.onClick(e);
      return;
    }

    if (this.state.downloading) return;

    window.dataLayer.push({
      event: 'health-record-download',
      'hr-record-type': this.props.docType,
    });

    if (this.downloadUrl) {
      window.open(this.downloadUrl, '_blank');
      return;
    }

    this.setState({ downloading: true });
    const requestUrl = `/v0/health_records?doc_type=${this.props.docType}`;
    apiRequest(
      requestUrl,
      null,
      response => {
        response.blob().then(blob => {
          const downloadUrl = URL.createObjectURL(blob);
          this.downloadUrl = downloadUrl;
          this.setState({ downloading: false });
          window.open(this.downloadUrl, '_blank');
        });
      },
      () => { this.setState({ downloading: false }); }
    );
  }

  render() {
    const loadingMessage = <span>Loading...</span>;

    return (
      <button onClick={this.downloadHealthRecord}>
        {this.state.downloading ? <i className="fa fa-spinner fa-pulse"></i> : null}
        {this.state.downloading ? loadingMessage : this.props.name}
      </button>
    );
  }
}

DownloadLink.propTypes = {
  name: PropTypes.string.isRequired,
  docType: PropTypes.oneOf(['pdf', 'txt']),
  onClick: PropTypes.func,
};

export default DownloadLink;
