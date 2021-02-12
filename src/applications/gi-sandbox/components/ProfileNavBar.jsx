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
    const profileNavBar = document.getElementById('profile-nav-bar');
    const topOffset = profileNavBar?.getBoundingClientRect().top < 0;
    if (topOffset) {
      profileNavBar.className = 'profile-nav-bar-stuck';
    } else {
      profileNavBar.className = 'profile-nav-bar-free';
    }
  };

  render() {
    return (
      <div id="profile-nav-bar" className="profile-nav-bar-free">
        {this.props.profileSections.map(section => (
          <span
            className="vads-u-margin-right--2"
            key={`${createId(section)}-nav-bar`}
          >
            <a href={`#${createId(section)}`}>{section}</a>
          </span>
        ))}
      </div>
    );
  }
}

export default connect()(ProfileNavBar);
