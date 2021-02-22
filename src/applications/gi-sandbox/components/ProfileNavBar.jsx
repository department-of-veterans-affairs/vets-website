import React from 'react';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';

import { createId } from '../utils/helpers';
import classNames from 'classnames';
import { getScrollOptions } from 'platform/utilities/ui';

export class ProfileNavBar extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  navBarDesktopClasses = (stuck = false) => {
    return classNames('profile-nav-bar', 'nav-bar-desktop-only', {
      'profile-nav-bar-stuck': stuck,
      row: !stuck,
    });
  };

  shouldBeStuck = () => {
    const profileNavBarDesktop = document.getElementById(
      'profile-nav-bar-desktop',
    );
    const placeholder = document.getElementById('profile-nav-placeholder');

    const topOffset = profileNavBarDesktop.getBoundingClientRect().top <= 0;
    const bottomOffset = placeholder.getBoundingClientRect().bottom <= 0;

    return topOffset && bottomOffset;
  };

  handleScroll = () => {
    const profileNavBarDesktop = document.getElementById(
      'profile-nav-bar-desktop',
    );
    const jumpLinks = document.getElementById('jump-links');

    if (this.shouldBeStuck()) {
      profileNavBarDesktop.className = this.navBarDesktopClasses(true);
      jumpLinks.className = 'row';
    } else {
      profileNavBarDesktop.className = this.navBarDesktopClasses();
      jumpLinks.className = 'row vads-u-margin--0';
    }
  };

  jumpLinkClicked = e => {
    e.preventDefault();
    const section = e.target.text;
    const profileNavBarDesktop = document.getElementById(
      'profile-nav-bar-desktop',
    );

    let offset = -profileNavBarDesktop.offsetHeight;
    if (!this.shouldBeStuck()) {
      offset = -(profileNavBarDesktop.offsetHeight * 2);
      // it's a magic number but it fixes the weird scrolling issue when navbar is unstuck
    }

    scroller.scrollTo(createId(section), getScrollOptions({ offset }));
  };

  render() {
    return (
      <>
        <span id="profile-nav-placeholder" />
        <div
          id="profile-nav-bar-desktop"
          className={this.navBarDesktopClasses()}
        >
          <div id="jump-links" className="row vads-u-margin--0">
            {this.props.profileSections.map(section => (
              <span
                className="vads-u-margin-right--1p5"
                key={`${createId(section)}-nav-bar`}
              >
                <a
                  href={`#${createId(section)}`}
                  onClick={this.jumpLinkClicked}
                >
                  {section}
                </a>
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
