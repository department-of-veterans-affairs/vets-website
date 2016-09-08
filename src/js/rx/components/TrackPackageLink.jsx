import React from 'react';

import classNames from 'classnames';

class TrackPackageLink extends React.Component {
  render() {
    const linkClass = classNames(
      'rx-track-package-link',
      this.props.className
    );

    return (
      <a
          className={linkClass}
          rel="noopener noreferrer"
          target="_blank">
        {this.props.text}
      </a>
    );
  }
}

TrackPackageLink.propTypes = {
  className: React.PropTypes.string,
  text: React.PropTypes.string.isRequired
};

export default TrackPackageLink;
