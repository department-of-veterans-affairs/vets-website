import React from 'react';

class PreviewBanner extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }
    const tz = { timeZone: 'America/New_York' };
    const when = new Date(this.props.version.createdAt).toLocaleString('us', tz);

    return (
      <div className="gi-preview-banner">
        <div className="outer small-12 medium-12 large-9">
          <div className="inner">
            <h5>Preview draft</h5>
            <p>
              This is what the version of this data from {when} will look like.&nbsp;
              <span className="actions">
                <a onClick={this.props.onViewLiveVersion}>View live version</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href={this.props.toolUrl}>Go back to the data tool</a>
              </span>
            </p>
          </div>
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
