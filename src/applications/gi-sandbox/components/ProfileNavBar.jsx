import React from 'react';
import { connect } from 'react-redux';

import { createId } from '../utils/helpers';
import classNames from 'classnames';

export class ProfileNavBar extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  classes = (stuck = false) => {
    return classNames('profile-nav-bar', 'nav-bar-desktop-only', {
      'profile-nav-bar-stuck': stuck,
    });
  };

  handleScroll = () => {
    const profileNavBar = document.getElementById('profile-nav-bar-desktop');
    const headingSummary = document.getElementById('profile-nav-placeholder');

    const topOffset = profileNavBar.getBoundingClientRect().top <= 0;
    const bottomOffset = headingSummary.getBoundingClientRect().bottom <= 0;

    if (topOffset && bottomOffset) {
      profileNavBar.className = this.classes(true);
    } else {
      profileNavBar.className = this.classes();
    }
  };

  render() {
    return (
      <>
        <span id="profile-nav-placeholder" />
        <div id="profile-nav-bar-desktop" className={this.classes()}>
          {this.props.profileSections.map(section => (
            <span
              className="vads-u-margin-right--1p5"
              key={`${createId(section)}-nav-bar`}
            >
              <a href={`#${createId(section)}`}>{section}</a>
            </span>
          ))}
        </div>
      </>
    );
  }
}

export default connect()(ProfileNavBar);
