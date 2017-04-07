import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class PreviewBanner extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    const headerDisplacementCSS = `
      div.header {
        margin-top: 4em;
      }
    `;
    const tz = { timeZone: 'America/New_York' };
    const when = new Date(this.props.version.createdAt).toLocaleString('us', tz);

    return (
      <div className="gi-preview-banner">
        <style>{headerDisplacementCSS}</style>
        <div className="outer"/>
        <div className="inner">
          <h5>Preview draft</h5>
          <p>
            This is what the version of this data from {when} will look like.
            <span className="actions">
              <a onClick={this.props.onViewLiveVersion}>View live version</a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href={this.props.toolUrl}>Go back to the data tool</a>
            </span>
          </p>
        </div>
      </div>
    );
  }
}

PreviewBanner.propTypes = {
  show: React.PropTypes.bool.isRequired,
  version: React.PropTypes.object.isRequired,
  toolUrl: React.PropTypes.string.isRequired,
  onViewLiveVersion: React.PropTypes.func.isRequired
};

PreviewBanner.defaultProps = {
  toolUrl: '/gids'
};

export default PreviewBanner;
