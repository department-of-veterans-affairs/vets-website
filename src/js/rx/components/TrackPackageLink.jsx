import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class TrackPackageLink extends React.Component {
  render() {
    const linkClass = classNames(
      'rx-track-package-link',
      this.props.className
    );

    let rel;
    let target;

    if (this.props.external) {
      rel = 'external noopener noreferrer';
      target = '_blank';
    }

    return (
      <Link
          className={linkClass}
          to={this.props.url}
          rel={rel}
          target={target}>
        {this.props.text}
      </Link>
    );
  }
}

TrackPackageLink.propTypes = {
  className: React.PropTypes.string,
  external: React.PropTypes.bool,
  text: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
};

export default TrackPackageLink;
