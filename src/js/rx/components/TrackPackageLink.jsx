import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class TrackPackageLink extends React.Component {
  render() {
    const linkClass = classNames(
      'rx-track-package-link',
      this.props.className
    );

    return (
      <Link
          className={linkClass}
          to={this.props.url}
          rel="noopener noreferrer"
          target="_blank">
        {this.props.text}
      </Link>
    );
  }
}

TrackPackageLink.propTypes = {
  className: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
};

export default TrackPackageLink;
