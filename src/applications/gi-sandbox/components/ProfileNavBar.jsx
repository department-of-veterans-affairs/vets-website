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
      row: !stuck,
    });
  };

  handleScroll = () => {
    const profileNavBarDesktop = document.getElementById(
      'profile-nav-bar-desktop',
    );
    const placeholder = document.getElementById('profile-nav-placeholder');
    const jumpLinks = document.getElementById('jump-links');

    const topOffset = profileNavBarDesktop.getBoundingClientRect().top <= 0;
    const bottomOffset = placeholder.getBoundingClientRect().bottom <= 0;

    if (topOffset && bottomOffset) {
      profileNavBarDesktop.className = this.classes(true);
      jumpLinks.className = 'row';
    } else {
      profileNavBarDesktop.className = this.classes();
      jumpLinks.className = 'row vads-u-margin--0';
    }
  };

  // jumpLinkClicked = e => {
  //   e.preventDefault();
  //   const section = document.getElementById(createId(e.target.text));
  //   const profileNavBarDesktop = document.getElementById(
  //     'profile-nav-bar-desktop',
  //   );
  //
  //   section.scroll(0, profileNavBarDesktop.offsetHeight);
  //   // section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  //   // section.scrollIntoView();
  // };

  render() {
    return (
      <>
        <span id="profile-nav-placeholder" />
        <div id="profile-nav-bar-desktop" className={this.classes()}>
          <div id="jump-links" className="row vads-u-margin--0">
            {this.props.profileSections.map(section => (
              <span
                className="vads-u-margin-right--1p5"
                key={`${createId(section)}-nav-bar`}
              >
                <a href={`#${createId(section)}`}>{section}</a>
              </span>
            ))}
          </div>
        </div>
        <div
          id="profile-nav-bar-mobile"
          className="nav-bar-mobile-only profile-nav-bar"
        >
          Coming soon in Story CT: Create mobile sticky nav custom component
          #19721
        </div>
      </>
    );
  }
}

export default connect()(ProfileNavBar);
