import React from 'react';

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

    return (
      <div className="gi-preview-banner">
        <style>{headerDisplacementCSS}</style>
        <div className="outer"/>
        <div className="inner">
          <h5>Preview draft</h5>
          <p>
            This is what the version of this data from {this.props.dataVersion} will look like.
            &nbsp;<a href={this.props.toolURL}>Go back to the data tool.</a>
          </p>
        </div>
      </div>
    );
  }
}

PreviewBanner.propTypes = {
  show: React.PropTypes.bool.isRequired,
  dataVersion: React.PropTypes.string.isRequired,
};

PreviewBanner.defaultProps = {
  dataVersion: 'Jan 7, 2016 at 11:33 a.m.',
  toolURL: 'http://www.usds.gov'
};

export default PreviewBanner;
