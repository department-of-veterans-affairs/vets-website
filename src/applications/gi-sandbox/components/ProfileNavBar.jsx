import React from 'react';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';

import { createId } from '../utils/helpers';
import classNames from 'classnames';
import { getScrollOptions } from 'platform/utilities/ui';
import { NAV_WIDTH } from '../constants';

export class ProfileNavBar extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  onDesktop = () => {
    return window.innerWidth >= NAV_WIDTH;
  };

  handleScroll = () => {
    if (this.onDesktop()) {
      this.handleDesktopScroll();
    } else {
      this.handleMobileScroll();
    }
  };

  shouldBeStuck = profileNavBar => {
    const placeholder = document.getElementById('profile-nav-placeholder');

    const topOffset = profileNavBar.getBoundingClientRect().top <= 0;
    const bottomOffset = placeholder.getBoundingClientRect().bottom <= 0;

    return topOffset && bottomOffset;
  };

  // Desktop functions

  handleDesktopScroll = () => {
    const profileNavBarDesktop = document.getElementById(
      'profile-nav-bar-desktop',
    );
    const jumpLinks = document.getElementById('jump-links');

    if (this.shouldBeStuck(profileNavBarDesktop)) {
      profileNavBarDesktop.className = this.navBarDesktopClasses(true);
      jumpLinks.className = 'row';
    } else {
      profileNavBarDesktop.className = this.navBarDesktopClasses();
      jumpLinks.className = 'row vads-u-margin--0';
    }
  };

  navBarDesktopClasses = (stuck = false) => {
    return classNames('profile-nav-bar', 'nav-bar-desktop-only', {
      'profile-nav-bar-stuck': stuck,
      row: !stuck,
    });
  };

  jumpLinkClickedDesktop = e => {
    e.preventDefault();
    const section = e.target.text;
    const profileNavBarDesktop = document.getElementById(
      'profile-nav-bar-desktop',
    );

    let offset = -profileNavBarDesktop.offsetHeight;
    if (!this.shouldBeStuck(profileNavBarDesktop)) {
      offset = -(profileNavBarDesktop.offsetHeight * 2);
      // it's a magic number but it fixes the weird scrolling issue when navbar is unstuck
    }

    scroller.scrollTo(createId(section), getScrollOptions({ offset }));
  };

  // Mobile functions

  handleMobileScroll = () => {
    const profileNavBarMobile = document.getElementById(
      'profile-nav-bar-mobile',
    );

    if (this.shouldBeStuck(profileNavBarMobile)) {
      profileNavBarMobile.className = this.navBarMobileClasses(true);
    } else {
      profileNavBarMobile.className = this.navBarMobileClasses();
    }
  };

  navBarMobileClasses = (stuck = false) => {
    return classNames('profile-nav-bar', 'nav-bar-mobile-only', {
      'profile-nav-bar-stuck': stuck,
    });
  };

  navigateMobile = _e => {
    // const arrow = e.target.id;
    // if (arrow === 'mobile-up-arrow') {
    // } else {
    // }
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
                  onClick={this.jumpLinkClickedDesktop}
                >
                  {section}
                </a>
              </span>
            ))}
          </div>
        </div>
        <div id="profile-nav-bar-mobile" className={this.navBarMobileClasses()}>
          <h2 className="vads-u-font-size--h3 vads-u-margin--0">
            Navigate this page
            <span
              className="vads-u-margin-right--1p5"
              style={{ float: 'right' }}
            >
              <i
                id="mobile-up-arrow"
                className={
                  'far fa-arrow-alt-circle-up vads-u-margin-right--1p5 vads-u-margin-top--0p5'
                }
                onClick={this.navigateMobile}
              />
              <i
                id="mobile-down-arrow"
                className={
                  'far fa-arrow-alt-circle-down vads-u-margin-right--1p5 vads-u-margin-top--0p5'
                }
                onClick={this.navigateMobile}
              />
            </span>
          </h2>
        </div>
      </>
    );
  }
}

export default connect()(ProfileNavBar);
