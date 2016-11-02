import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class TrackPackageLink extends React.Component {
  render() {
    const linkClass = classNames(
      'rx-track-package-link',
      this.props.className
    );

    let link;

    if (this.props.external) {
      link = (
        <a
            className={linkClass}
            href={this.props.url}
            rel="external noopener noreferrer"
            target="_blank">
          {this.props.text}
        </a>
      );
    } else {
      link = (
        <Link
            className={linkClass}
            to={this.props.url}>
          {this.props.text}
        </Link>
      );
    }

    return link;
  }
}

TrackPackageLink.propTypes = {
  className: React.PropTypes.string,
  external: React.PropTypes.bool,
  text: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
};

export default TrackPackageLink;
