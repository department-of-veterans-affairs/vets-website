import React from 'react';
import { connect } from 'react-redux';

import { createId } from '../utils/helpers';

export class ProfileNavBar extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  handleScroll = () => {
    const profileNavBar = document.getElementById('profile-nav-bar-desktop');
    const headingSummary = document.getElementById('profile-nav-container');

    const topOffset = profileNavBar.getBoundingClientRect().top <= 0;
    const bottomOffset = headingSummary.getBoundingClientRect().bottom <= 0;

    if (topOffset && bottomOffset) {
      profileNavBar.className = 'profile-nav-bar-stuck desktop-only';
    } else {
      profileNavBar.className = 'profile-nav-bar-free desktop-only';
    }
  };

  render() {
    return (
      <div id="profile-nav-container">
        <div
          id="profile-nav-bar-desktop"
          className="profile-nav-bar-free desktop-only"
        >
          {this.props.profileSections.map(section => (
            <span
              className="vads-u-margin-right--2"
              key={`${createId(section)}-nav-bar`}
            >
              <a href={`#${createId(section)}`}>{section}</a>
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default connect()(ProfileNavBar);
