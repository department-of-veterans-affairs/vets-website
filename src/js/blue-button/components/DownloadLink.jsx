import React from 'react';
import classNames from 'classnames';

import { apiRequest } from '../utils/helpers';

class DownloadLink extends React.Component {
  constructor(props) {
    super(props);
    this.downloadHealthRecord = this.downloadHealthRecord.bind(this);
    this.downloadUrl = null;
    this.state = { downloading: false };
  }

  downloadHealthRecord(e) {
    e.preventDefault();

    if (this.state.downloading) return;

    if (this.downloadUrl) {
      window.open(this.downloadUrl, '_blank');
      return;
    }

    this.setState({ downloading: true });
    const requestUrl = '/v0/health_records';
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
    const iconClass = classNames({
      fa: true,
      'fa-spinner': this.state.downloading,
      'fa-pulse': this.state.downloading,
    });

    const loadingMessage = <span>Loading...</span>;

    return (
      <button onClick={this.downloadHealthRecord} href={this.props.url}>
        <i className={iconClass}></i>
        {this.state.downloading ? loadingMessage : this.props.name}
      </button>
    );
  }
}

DownloadLink.propTypes = {
  name: React.PropTypes.string,
  contentType: React.PropTypes.string,
};

export default DownloadLink;
